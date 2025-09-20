"use server"

import { completeAccountClaim, initiateAccountClaim } from "./clerk"
import { claimAccount } from "./profile"

export async function sendClaimEmail(email: string, username: string) {
  try {
    const result = await initiateAccountClaim(email, username)
    return {
      success: true,
      message:
        result.message ||
        "Claim initiated successfully. Please follow the instructions sent to your email.",
      data: result,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send claim email",
    }
  }
}

export async function finalizeAccountClaim(userId: string) {
  try {
    // Update Clerk metadata
    await completeAccountClaim(userId)

    // Update Supabase profile
    await claimAccount(userId)

    return {
      success: true,
      message: "Account successfully claimed!",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to finalize account claim",
    }
  }
}
