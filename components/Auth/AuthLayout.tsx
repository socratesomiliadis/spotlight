import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`auth-layout-wrapper overflow-hidden w-screen h-screen bg-white flex justify-center items-center`}
      >
        <div className="section-wrapper w-[90%] overflow-hidden relative h-[90%] border-[1px] border-black/20 rounded-2xl flex flex-row">
          <div className="left-side bg-black w-1/2 relative flex items-center justify-center">
            <div className="image-wrapper h-[85%] rounded-2xl overflow-hidden relative flex items-center justify-center">
              <Image
                src="/static/images/Logo.png"
                width={157}
                height={37}
                alt="Spotlight Logo"
                className="absolute z-[3] top-6 left-6 w-24"
              />
              <p className="absolute text-sm z-[3] bottom-6 left-6 text-[#BFBFBF]">
                By signing in, you agree to Spotlight&apos;s{" "}
                <Link href="/terms" className="underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent absolute left-0 bottom-0 z-[2]" />
              <Image
                src="/static/images/authImage.png"
                width={1500 / 2}
                height={2060 / 2}
                alt=""
                className="rounded-2xl w-full z-[1] h-full object-cover"
              />
            </div>
            <Image
              src="/static/images/authImage.png"
              width={1500 / 4}
              height={2060 / 4}
              alt=""
              className="w-auto h-[85%] z-0 blur-[150px] transform-gpu absolute rounded-2xl object-cover"
            />
          </div>
          <div className="right-side h-full w-1/2 relative flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
