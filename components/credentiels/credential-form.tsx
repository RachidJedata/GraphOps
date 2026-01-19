"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import { CredientielType } from '@/lib/generated/prisma/enums';
import { toast } from 'sonner';
import { useCreateCredentiel, useUpdateCredentiel } from '@/hooks/credentiels/use-credentiels';
import { useRouter } from 'next/navigation';
import { useUpgradeModal } from '@/lib/use-upgrade-modal';
import Image from 'next/image';
import Link from 'next/link';


const baseSchema = {
    name: z.string()
        .min(3, { message: 'Name must be at least 3 characters' })
        .max(100, { message: 'Name must not exceed 100 characters' }),

    type: z.enum(CredientielType),
};
const createCredentialSchema = z.object({
    ...baseSchema,
    value: z.string()
        .min(8, { message: 'Value must be at least 8 characters' })
        .max(500, { message: 'Value must not exceed 500 characters' }),
});
const updateCredentialSchema = z.object({
    ...baseSchema,
    value: z.string()
        .min(8, { message: 'Value must be at least 8 characters' })
        .max(500, { message: 'Value must not exceed 500 characters' })
        .optional()
        .or(z.literal('')),
});


type CredentialFormValues =
    | z.infer<typeof createCredentialSchema>
    | z.infer<typeof updateCredentialSchema>;

const credentialTypeOption = [
    {
        type: CredientielType.ANTHROPIC,
        label: "Anthropic",
        logo: "/icons/anthropic.svg",
    },
    {
        type: CredientielType.OPENAI,
        label: "OpenAI",
        logo: "/icons/openai.svg",
    },
    {
        type: CredientielType.GEMINI,
        label: "Gemini",
        logo: "/icons/gemini.svg",
    },
]

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        // value?: string;
        type: CredientielType
    }
}

export function CredentialForm({ initialData }: CredentialFormProps) {

    const createCredential = useCreateCredentiel();
    const updateCredential = useUpdateCredentiel();

    const { handleError, modal } = useUpgradeModal();

    const router = useRouter();

    const [showValue, setShowValue] = useState(false);

    const isEditMode = !!initialData?.id;

    const form = useForm<CredentialFormValues>({
        resolver: zodResolver(isEditMode ? updateCredentialSchema : createCredentialSchema),
        defaultValues: {
            name: initialData?.name || '',
            type: initialData?.type || 'OPENAI',
            value: '',
        },
    });

    const handleFormSubmit = async (values: CredentialFormValues) => {

        if (isEditMode && initialData.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values,
            }, {
                onSuccess: (data) => {
                    toast.success(`Credential ${data.name} updated successfully!`);
                    router.push(`/credentials`);
                },
                onError: (err) => {
                    toast.error(`Error happened: ${err.message}, please try again!`);
                    handleError(err);
                }
            })

        } else {
            const { name, type, value } = values;
            if (!value) {
                toast.error(`Credential value is required`);
                return;
            }

            await createCredential.mutateAsync({ name, type, value }, {
                onSuccess: (data) => {
                    toast.success('Credential created successfully!');
                    router.push(`/credentials`);
                },
                onError: (err) => {
                    toast.success(`Error happened: ${err.message}, please try again!`);
                    handleError(err);
                }
            })
        }
    };


    return (
        <>
            {modal}
            <div className="w-full max-w-2xl mx-auto p-6 pt-0">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEditMode ? 'Update Credential' : 'Create New Credential'}
                        </CardTitle>
                        <CardDescription>
                            {isEditMode
                                ? 'Update your existing credential information'
                                : 'Add a new credential to your secure vault'
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={form.handleSubmit(handleFormSubmit)} >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Credential Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Production API Key"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A descriptive name for this credential
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Credential Type <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl className='w-full'>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select credential type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {credentialTypeOption.map(type => (
                                                        <SelectItem key={type.label} value={type.type}>
                                                            <Image src={type.logo} alt={type.label} width={10} height={10} className='size-4' />
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                The type of credential you're storing
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Credential Value: {!isEditMode ? (<span className="text-red-500">*</span>) : (<span className="text-green-700">(leave it empty if you don't wanna change it)</span>)}
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showValue ? 'text' : 'password'}
                                                        placeholder="Enter credential value"
                                                        {...field}
                                                        className="pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowValue(!showValue)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showValue ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                The actual credential value (minimum 8 characters)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Credentials are encrypted and stored securely.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex gap-2 items-center">
                                    <Button
                                        type="submit"
                                        disabled={createCredential.isPending || updateCredential.isPending}
                                        className="gap-2 "
                                    >
                                        <Save className="h-4 w-4" />
                                        {createCredential.isPending || updateCredential.isPending
                                            ? 'Saving...'
                                            : isEditMode
                                                ? 'Update Credential'
                                                : 'Create Credential'
                                        }
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className='p-4'
                                        asChild
                                    >
                                        <Link href="/credentials" prefetch>
                                            Cancel
                                        </Link>
                                    </Button>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}