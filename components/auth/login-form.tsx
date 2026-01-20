"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import OAuthLogin from "./o-auth"

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type loginFormValues = z.infer<typeof loginSchema>;


export function LoginForm({
  className,
}: React.ComponentProps<"form">) {

  const router = useRouter();

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: loginFormValues) => {
    // console.log(values);
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/'
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        }
      }
    )
  }

  const isPending = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className={cn("flex flex-col gap-6", className)} onSubmit={form.handleSubmit(handleSubmit)} >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold text-primary">Login to your account</h1>
            <p className=" text-sm text-balance text-primary/80">
              Enter your email below to login to your account
            </p>
          </div>
          <Field>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input id="email" type="email" placeholder="me@example.com" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>

                  <Input id="password"
                    type="password"
                    placeholder="***********" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <Button className="cursor-pointer" type="submit" disabled={isPending}>Login</Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <OAuthLogin isPending={isPending} />

            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-primary underline underline-offset-4">
                Sign up
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
