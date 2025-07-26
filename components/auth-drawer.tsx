"use client"

import { useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { useQueryState } from "nuqs"
import { Drawer } from "vaul"

import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect"
import SignIn from "@/components/AuthPages/sign-in"
import SignUp from "@/components/AuthPages/sign-up"

import ResetPassword from "./AuthPages/reset-password"
import CustomButton from "./custom-button"
import TextSplit from "./text-split"

export default function DrawerComp({ userExists }: { userExists: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const [auth, setAuth] = useQueryState("auth")
  const lenis = useLenis()

  const authTypes = ["sign-in", "sign-up", "reset-password"]

  useEffect(() => {
    if (authTypes?.includes(auth ?? "") && !userExists) {
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
        if (!open) setAuth(null)
      }}
    >
      <Drawer.Trigger asChild>
        {!userExists ? (
          <CustomButton text="Sign In" onClick={() => setAuth("sign-in")} />
        ) : null}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Title className="sr-only">
          {auth === "sign-in"
            ? "Sign In"
            : auth === "sign-up"
              ? "Sign Up"
              : "Reset Password"}
        </Drawer.Title>
        <Drawer.Description className="sr-only">
          {auth === "sign-in"
            ? "Sign In"
            : auth === "sign-up"
              ? "Sign Up"
              : "Reset Password"}
        </Drawer.Description>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur z-[100]" />
        <Drawer.Content className="bg-white rounded-b-3xl w-screen lg:w-[56vw] h-fit fixed top-0 left-0 lg:left-[22%] outline-none z-[101]">
          {auth === "sign-in" ? (
            <SignIn />
          ) : auth === "sign-up" ? (
            <SignUp />
          ) : (
            <ResetPassword />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
