import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Form, InputOtp, Spinner } from "@heroui/react"
import { useConvexAuth, useMutation } from "convex/react"
import { motion } from "motion/react"
import { useQueryState } from "nuqs"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export default function SignUpVerify({
  pendingUser,
}: {
  pendingUser: { email: string; username: string; displayName: string }
}) {
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAwaitingConvexAuth, setIsAwaitingConvexAuth] = useState(false)
  const ensureCurrentStarted = useRef(false)
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const [, setAuth] = useQueryState("auth")
  const ensureCurrent = useMutation(api.profiles.ensureCurrent)
  const router = useRouter()

  useEffect(() => {
    if (
      !isAwaitingConvexAuth ||
      isAuthLoading ||
      !isAuthenticated ||
      ensureCurrentStarted.current
    ) {
      return
    }

    ensureCurrentStarted.current = true
    void (async () => {
      try {
        await ensureCurrent({
          username: pendingUser.username,
          displayName: pendingUser.displayName,
        })
        setAuth(null)
        router.push("/welcome")
      } catch (err) {
        ensureCurrentStarted.current = false
        setIsAwaitingConvexAuth(false)
        setError(err instanceof Error ? err.message : "Verification failed")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [
    ensureCurrent,
    isAuthenticated,
    isAuthLoading,
    isAwaitingConvexAuth,
    pendingUser.displayName,
    pendingUser.username,
    router,
    setAuth,
  ])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    router.prefetch("/welcome")
    setIsLoading(true)
    ensureCurrentStarted.current = false
    setIsAwaitingConvexAuth(false)
    setError(null)

    try {
      const response = await (authClient as any).emailOtp.verifyEmail({
        email: pendingUser.email,
        otp: code || "",
      })
      if (response?.error) throw new Error(response.error.message)
      await authClient.getSession({ fetchOptions: { throw: false } })
      setIsAwaitingConvexAuth(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key="sign-up-verify"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full flex items-center justify-center px-2 lg:px-0 py-4 lg:py-0"
    >
      <Form className="w-[90%]" onSubmit={handleVerify}>
        <h1 className="text-3xl lg:text-4xl tracking-tight mb-3">
          Verify your email to
          <br />
          unleash your dreams.
        </h1>
        <InputOtp
          description="Enter the 6 digit code sent to your email"
          length={6}
          value={code || ""}
          onValueChange={setCode}
          radius="none"
        />
        <button
          type="submit"
          disabled={isLoading}
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
  )
}
