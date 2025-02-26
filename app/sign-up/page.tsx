import Image from "next/image";
import Link from "next/link";
import Input from "@/components/Forms/Input";

export default function SignUp() {
  return (
    <main className="w-screen h-[100svh] flex flex-row items-center justify-center pt-[10vh] pb-[5vh] text-darkGreen">
      <div className="w-[90%] h-full rounded-3xl border-black/10 border-[1px] flex flex-row p-4">
        <div className="w-1/2 h-full relative">
          <p className="text-xl tracking-tight absolute left-6 bottom-6 z-20 text-white">
            By signing up, you agree to Spotlight&apos;s <br />
            <Link href="/terms-of-service" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
          <Image
            src="/static/images/signUp.png"
            alt="Sign Up"
            width={1200}
            height={1200}
            className="w-full h-full object-cover rounded-2xl relative z-10"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col items-center justify-center">
          <Input label="Email" />
        </div>
      </div>
    </main>
  );
}
