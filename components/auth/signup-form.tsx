"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import OAuthLogin from "./o-auth"

const signupSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm({
  className,
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const isPending = form.formState.isSubmitting

  const handleSubmit = async (values: SignupFormValues) => {
    // console.log(values)
    await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: '/',
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("flex flex-col gap-6", className)}
        noValidate
      >
        <FieldGroup>
          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold text-primary">
              Create an account
            </h1>
            <p className="text-sm text-primary/80">
              Enter your information below to create your account
            </p>
          </div>

          {/* Full name */}
          <Field>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          {/* Email */}
          <Field>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="me@example.com"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          {/* Password */}
          <Field>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          {/* Confirm password */}
          <Field>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          {/* Submit */}
          <Field>
            <Button className="cursor-pointer bg-primary" type="submit" disabled={isPending}>
              Create Account
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          {/* OAuth + footer */}
          <Field>
            <OAuthLogin isPending={isPending} />
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <a href="/login" className="text-primary underline underline-offset-4">
                Login
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
