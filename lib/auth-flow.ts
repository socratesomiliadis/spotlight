export const OTP_COOLDOWN_SECONDS = 60

export function safeReturnTo(value?: string | null, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }
  return value
}

export function signInUrl(returnTo: string) {
  return `/?auth=sign-in&returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`
}

export function authErrorMessage(error: unknown, fallback = "Request failed") {
  const message =
    error instanceof Error
      ? error.message
      : error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message)
        : typeof error === "string"
          ? error
          : fallback
  const normalized = message.toLowerCase()

  if (normalized.includes("invalid email or password")) {
    return "The email, username, or password is incorrect."
  }
  if (normalized.includes("invalid otp") || normalized.includes("invalid code")) {
    return "That code is not valid. Check the code and try again."
  }
  if (normalized.includes("otp expired") || normalized.includes("expired")) {
    return "That code has expired. Request a new one and try again."
  }
  if (
    normalized.includes("too many") ||
    normalized.includes("rate limit") ||
    normalized.includes("rate_limit")
  ) {
    return "Too many attempts. Please wait a moment before trying again."
  }
  if (normalized.includes("email already in use")) {
    return "That email address is already in use."
  }
  if (normalized.includes("not fresh") || normalized.includes("session")) {
    return "For your security, sign in again before making this change."
  }
  if (normalized.includes("auth email delivery is not configured")) {
    return "Email delivery is not configured. Ask an admin to check auth email settings."
  }
  if (normalized.includes("otp is required to verify current email")) {
    return "Enter the code sent to your current email first."
  }

  return message || fallback
}
