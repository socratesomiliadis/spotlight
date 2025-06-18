"use client";

import { Form, Spinner } from "@heroui/react";
import MyInput from "./components/Input";
import { useState } from "react";
import { Eye } from "../icons";
import { EyeClosed } from "../icons";
import { useSignIn } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useQueryState } from "nuqs";

// Define validation schema with Zod
const signInSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Email or username is required")
    .refine(
      (value) => !value.includes(" "),
      "Email or username cannot contain spaces"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [auth, setAuth] = useQueryState("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    if (!isLoaded) return;
    setIsLoading(true);
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: data.emailOrUsername,
        password: data.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        setIsLoading(false);
        await setActive({ session: signInAttempt.createdSessionId });
        router.refresh();
        // setAuth(null);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setIsLoading(false);
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setIsLoading(false);
      console.error(JSON.stringify(err, null, 2));
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <motion.div
      key="sign-in-form"
      exit={{ opacity: 0, x: -100 }}
      className="w-full flex items-center justify-center"
    >
      <Form className="w-[90%] max-w-md" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-4xl tracking-tight mb-8">
          Sign in to your account
        </h1>
        <MyInput
          label="Email or Username"
          {...register("emailOrUsername")}
          isInvalid={!!errors.emailOrUsername}
          errorMessage={errors.emailOrUsername?.message}
          autoComplete="username"
        />

        <MyInput
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          autoComplete="password"
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none w-6 pt-1 h-full flex items-center justify-center overflow-hidden text-[#BFBFBF]"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          }
        />

        <div id="clerk-captcha" />
        <button
          type="submit"
          className="w-full mt-4 py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center"
        >
          {isLoading && (
            <Spinner className="absolute" color="white" size="sm" />
          )}
          <span className={cn("-mb-1", isLoading && "opacity-0")}>Sign In</span>
        </button>
        {error && <p className="text-danger">{error}</p>}
        <p className="text-sm text-black mt-4 tracking-tight">
          Don&apos;t have an account?{" "}
          <button className="underline" onClick={() => setAuth("sign-up")}>
            Sign up
          </button>
        </p>
      </Form>
    </motion.div>
  );
}
