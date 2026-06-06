"use client"

import { useEffect, useState } from "react"
import { useLenis } from "lenis/react"
import { useQueryState } from "nuqs"
import { Drawer } from "vaul"

import SignIn from "@/components/AuthPages/sign-in"
import SignUp from "@/components/AuthPages/sign-up"

import ResetPassword from "./AuthPages/reset-password"
import CustomButton from "./custom-button"

const authTypes = ["sign-in", "sign-up", "reset-password"] as const

type AuthType = (typeof authTypes)[number]

function isAuthType(value: string | null): value is AuthType {
  return authTypes.includes(value as AuthType)
}

export default function DrawerComp({ userExists }: { userExists: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeAuth, setActiveAuth] = useState<AuthType>("sign-in")
  const [auth, setAuth] = useQueryState("auth")
  const [, setReturnTo] = useQueryState("returnTo")
  const lenis = useLenis()

  const openAuthDrawer = (authType: AuthType) => {
    setActiveAuth(authType)
    setIsOpen(true)
    void setAuth(authType)
  }

  useEffect(() => {
    if (isAuthType(auth) && !userExists) {
      setActiveAuth(auth)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [auth, userExists])

  useEffect(() => {
    if (isOpen) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [isOpen, lenis])

  return (
    <Drawer.Root
      repositionInputs={false}
      direction="top"
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          void setAuth(null)
          void setReturnTo(null)
        }
      }}
    >
      <Drawer.Trigger asChild>
        {!userExists ? (
          <CustomButton
            text="Sign In"
            onClick={() => openAuthDrawer("sign-in")}
          />
        ) : null}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Title className="sr-only">
          {activeAuth === "sign-in"
            ? "Sign In"
            : activeAuth === "sign-up"
              ? "Sign Up"
              : "Reset Password"}
        </Drawer.Title>
        <Drawer.Description className="sr-only">
          {activeAuth === "sign-in"
            ? "Sign In"
            : activeAuth === "sign-up"
              ? "Sign Up"
              : "Reset Password"}
        </Drawer.Description>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100" />
        <Drawer.Content className="bg-white rounded-b-3xl w-screen lg:w-[56vw] h-fit fixed top-0 left-0 lg:left-[22%] outline-hidden z-101 transform-gpu">
          {activeAuth === "sign-in" ? (
            <SignIn />
          ) : activeAuth === "sign-up" ? (
            <SignUp />
          ) : (
            <ResetPassword />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
