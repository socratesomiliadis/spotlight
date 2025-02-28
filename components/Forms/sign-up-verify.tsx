import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, InputOtp, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
export default function SignUpVerify() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;
    setIsLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code || "",
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        setIsLoading(false);
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/welcome");
        router.refresh();
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setIsLoading(false);
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="sign-up-verify"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full flex items-center justify-center"
    >
      <Form className="w-[90%] max-w-md" onSubmit={handleVerify}>
        <h1 className="text-4xl tracking-tight mb-3">
          Verify your email to
          <br />
          unleash your dreams.
        </h1>
        <InputOtp
          classNames={{
            segmentWrapper: "gap-x-0",
            segment: [
              "relative",
              "h-10",
              "w-10",
              "border-y",
              "border-r",
              "first:rounded-l-md",
              "first:border-l",
              "last:rounded-r-md",
              "border-default-200",
              "bg-transparent",
              "data-[active=true]:border",
              "data-[active=true]:z-20",
              "data-[active=true]:ring-2",
              "data-[active=true]:ring-offset-2",
              "data-[active=true]:ring-black",
            ],
          }}
          description="Enter the 6 digit code sent to your email"
          length={6}
          value={code || ""}
          onValueChange={setCode}
          radius="none"
        />
        <button
          type="submit"
          className="w-full mt-4 py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center"
        >
          {isLoading && (
            <Spinner className="absolute" color="white" size="sm" />
          )}
          <span className={cn("-mb-1", isLoading && "opacity-0")}>
            Verify Email
          </span>
        </button>
        {error && <p className="text-danger">{error}</p>}
      </Form>
    </motion.div>
  );
}
