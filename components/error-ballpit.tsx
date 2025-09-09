"use client"

import { useMediaQuery } from "usehooks-ts"

import Ballpit from "./ballpit"

export default function ErrorBallpit() {
  const isMobile = useMediaQuery("(max-width: 1024px)")
  return (
    <Ballpit
      count={isMobile ? 50 : 100}
      gravity={0.1}
      friction={0.9975}
      wallBounce={1}
      colors={[0x1c1c1c, 0x000000, 0xff77fa]}
      lightIntensity={10}
      followCursor={true}
    />
  )
}
