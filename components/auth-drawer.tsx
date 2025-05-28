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
import { useAuth } from "@clerk/nextjs";
import { useQueryState } from "nuqs";

export default function DrawerComp() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const { userId } = useAuth();
  const authTypes = ["sign-in", "sign-up"];
  const [auth, setAuth] = useQueryState("auth");

  useEffect(() => {
    if (authTypes.includes(auth ?? "") && !userId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [auth, userId]);

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);

  useIsomorphicLayoutEffect(() => {
    const target = ref.current as HTMLButtonElement;
    const normalChars = target?.querySelectorAll(
      ".normal-chars"
    ) as NodeListOf<HTMLElement>;
    const hoverChars = target?.querySelectorAll(
      ".hover-chars"
    ) as NodeListOf<HTMLElement>;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 1,
          ease: "elastic.out(1.2, 1)",
          stagger: {
            amount: 0.1,
            from: "start",
          },
        },
      });
      if (isHovered) {
        tl.to(normalChars, {
          y: "-120%",
        });
        tl.to(
          hoverChars,
          {
            y: "0%",
          },
          0
        );
      } else {
        tl.to(normalChars, {
          y: "0%",
        });
        tl.to(
          hoverChars,
          {
            y: "120%",
          },
          0
        );
      }
    });

    return () => {
      ctx.kill();
    };
  }, [isHovered]);

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
        {!userId ? (
          <button
            ref={ref}
            onClick={() => setAuth("sign-in")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "bg-black px-6 py-2 rounded-xl text-white tracking-tight text-lg font-medium relative overflow-hidden flex items-center justify-center"
            )}
          >
            <TextSplit
              types={"chars"}
              charsClassName="normal-chars"
              className="-mb-1"
            >
              Sign In
            </TextSplit>
            <TextSplit
              types={"chars"}
              charsClassName="hover-chars translate-y-[120%]"
              className="absolute -mb-1"
            >
              Sign In
            </TextSplit>
          </button>
        ) : null}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Title className="sr-only">Test</Drawer.Title>
        <Drawer.Description className="sr-only">Test</Drawer.Description>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur z-[100]" />
        <Drawer.Content className="bg-white h-fit fixed top-0 left-0 right-0 outline-none z-[101]">
          {auth === "sign-in" ? <SignIn /> : <SignUp />}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
