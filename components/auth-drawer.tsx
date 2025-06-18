"use client";

import { Drawer } from "vaul";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import TextSplit from "./text-split";
import { useLenis } from "lenis/react";
import SignIn from "@/components/AuthPages/sign-in";
import SignUp from "@/components/AuthPages/sign-up";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { useQueryState } from "nuqs";
import CustomButton from "./custom-button";

export default function DrawerComp({ userExists }: { userExists: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [auth, setAuth] = useQueryState("auth");
  const lenis = useLenis();

  const authTypes = ["sign-in", "sign-up"];

  useEffect(() => {
    if (authTypes?.includes(auth ?? "") && !userExists) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [auth, userExists]);

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);

  return (
    <Drawer.Root
      direction="top"
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setAuth(null);
      }}
    >
      <Drawer.Trigger asChild>
        {!userExists ? (
          <CustomButton text="Sign In" onClick={() => setAuth("sign-in")} />
        ) : null}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Title className="sr-only">
          {auth === "sign-in" ? "Sign In" : "Sign Up"}
        </Drawer.Title>
        <Drawer.Description className="sr-only">
          {auth === "sign-in" ? "Sign In" : "Sign Up"}
        </Drawer.Description>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur z-[100]" />
        <Drawer.Content className="bg-white rounded-b-3xl w-[75vw] h-fit fixed top-0 left-[12.5%] outline-none z-[101]">
          {auth === "sign-in" ? <SignIn /> : <SignUp />}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
