type EmailTemplate = {
  subject: string
  html: string
}

type TemplateLinkArgs = {
  url: string
}

type OtpArgs = {
  otp: string
  type?: string
}

type SecurityNotificationArgs = {
  title: string
  message: string
}

const textColor = "#0A0A0A"
const mutedColor = "#2E2E2E"
const defaultSiteUrl = "http://localhost:3000"

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function publicAssetUrl(path: string) {
  const baseUrl =
    process.env.SITE_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    defaultSiteUrl

  return `${baseUrl.replace(/\/$/, "")}${path}`
}

function spotlightLogo() {
  const logoUrl = publicAssetUrl("/logo.png")

  return `
    <img src="${escapeHtml(logoUrl)}" width="132" height="25" alt="Spotlight" style="display: block; width: 132px; height: auto; border: 0; outline: none; text-decoration: none;" />
  `
}

function emailShell({
  title,
  body,
  action,
  requestNote,
}: {
  title: string
  body: string
  action: string
  requestNote?: string
}) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin: 0; padding: 0; background: #ffffff; font-family: Arial, Helvetica, sans-serif; color: ${textColor};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #ffffff;">
      <tr>
        <td align="center" style="padding: 78px 24px 40px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px;">
            <tr>
              <td style="padding: 0 0 54px;">
                ${spotlightLogo()}
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 30px;">
                <h1 style="margin: 0; color: ${textColor}; font-size: 34px; line-height: 1.12; font-weight: 700; letter-spacing: 0;">
                  ${escapeHtml(title)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 24px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 64px;">
                ${action}
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin: 0 0 6px; color: ${textColor}; font-size: 15px; line-height: 1.35; font-weight: 700;">
                  Didn't request this?
                </p>
                <p style="margin: 0; color: ${textColor}; font-size: 15px; line-height: 1.35; font-weight: 600;">
                  ${requestNote || "If you didn't make this request, you can safely ignore this email."}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function paragraph(text: string) {
  return `<p style="margin: 0; color: ${textColor}; font-size: 15px; line-height: 1.45; font-weight: 500;">${escapeHtml(text)}</p>`
}

function buttonLink({ label, url }: { label: string; url: string }) {
  return `
    <a href="${escapeHtml(url)}" style="display: inline-block; background: ${textColor}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; line-height: 1; padding: 15px 20px; border-radius: 8px;">
      ${escapeHtml(label)}
    </a>
    <p style="margin: 18px 0 0; color: ${mutedColor}; font-size: 13px; line-height: 1.45; font-weight: 500;">
      If the button does not work, copy and paste this URL into your browser:<br />
      <span style="word-break: break-all;">${escapeHtml(url)}</span>
    </p>
  `
}

function codeBlock({ otp, codeName }: { otp: string; codeName: string }) {
  return `
    <p style="margin: 0 0 24px; color: ${textColor}; font-size: 15px; line-height: 1.45; font-weight: 500;">
      Enter the following ${escapeHtml(codeName)} when prompted:
    </p>
    <p style="margin: 0; color: ${textColor}; font-size: 42px; line-height: 1; font-weight: 700; letter-spacing: 0;">
      ${escapeHtml(otp)}
    </p>
  `
}

export function verificationLinkEmail({
  url,
}: TemplateLinkArgs): EmailTemplate {
  return {
    subject: "Verify your Spotlight email",
    html: emailShell({
      title: "Verify your email",
      body: paragraph(
        "Open the secure link below to verify your email address and finish setting up your Spotlight account."
      ),
      action: buttonLink({ label: "Verify email", url }),
    }),
  }
}

export function resetPasswordLinkEmail({
  url,
}: TemplateLinkArgs): EmailTemplate {
  return {
    subject: "Reset your Spotlight password",
    html: emailShell({
      title: "Reset your password",
      body: paragraph(
        "Use the secure link below to choose a new password for your Spotlight account."
      ),
      action: buttonLink({ label: "Reset password", url }),
    }),
  }
}

export function otpEmail({ otp, type }: OtpArgs): EmailTemplate {
  const isPasswordReset = type === "forget-password"

  return {
    subject: isPasswordReset
      ? `${otp} is your password reset code`
      : `${otp} is your verification code`,
    html: emailShell({
      title: isPasswordReset ? "Password reset code" : "Verification code",
      body: codeBlock({
        otp,
        codeName: isPasswordReset ? "password reset code" : "verification code",
      }),
      action: paragraph("To protect your account, do not share this code."),
    }),
  }
}

export function securityNotificationEmail({
  title,
  message,
}: SecurityNotificationArgs): EmailTemplate {
  return {
    subject: title,
    html: emailShell({
      title,
      body: paragraph(message),
      action: paragraph(
        "You can review your account sessions and security settings from Spotlight settings."
      ),
      requestNote:
        "If you did not make this change, reset your password and contact Spotlight support.",
    }),
  }
}

export const emailPreviewSamples = [
  {
    id: "verification-link",
    label: "Email verification link",
    ...verificationLinkEmail({
      url: "https://spotlight.day/api/auth/verify-email?token=preview-token",
    }),
  },
  {
    id: "reset-password-link",
    label: "Password reset link",
    ...resetPasswordLinkEmail({
      url: "https://spotlight.day/api/auth/reset-password?token=preview-token",
    }),
  },
  {
    id: "verification-code",
    label: "Verification code",
    ...otpEmail({ otp: "982500", type: "email-verification" }),
  },
  {
    id: "password-reset-code",
    label: "Password reset / claim code",
    ...otpEmail({ otp: "654321", type: "forget-password" }),
  },
  {
    id: "security-notification",
    label: "Security notification",
    ...securityNotificationEmail({
      title: "Your Spotlight password was changed",
      message:
        "The password for your Spotlight account was changed successfully.",
    }),
  },
]
