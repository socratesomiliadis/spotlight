# Account Claiming Feature

This guide explains how the new account claiming feature works in Spotlight.

## Overview

The account claiming feature allows users to claim unclaimed accounts that were created on their behalf, provided they have access to the associated email address.

## How It Works

### For Unclaimed Accounts

1. **Visual Indicator**: Unclaimed accounts display an "Unclaimed" badge next to the user's name
2. **Claim Button**: Instead of Follow/Hire buttons, unclaimed profiles show a "Claim Account" button
3. **Email Verification**: Users must verify they have access to the account's email to begin the claim process

### Claiming Process

1. **Navigate to Claim Page**:
   - User clicks "Claim Account" button on the profile
   - Redirected to `/claim/[username]` with a dedicated claim interface
   - User enters the email associated with the unclaimed account

2. **Email Verification & Instructions**:
   - System verifies the email matches the account
   - User receives clear step-by-step instructions
   - Guided to use Clerk's "Forgot Password" flow for security

3. **Password Reset Flow**:
   - User goes to sign-in page and clicks "Forgot Password"
   - Enters the verified email and receives a password reset link
   - Sets a new password through Clerk's secure reset process

4. **Account Finalization**:
   - Webhook automatically detects the password change
   - Account is marked as claimed (is_unclaimed = false)
   - Success page confirms the claim completion
   - User can now access their account normally

## Files Modified

### Server Actions

- `lib/supabase/actions/clerk.ts` - Clerk API integration for account claiming
- `lib/supabase/actions/profile.ts` - Supabase profile updates
- `lib/supabase/actions/claim.ts` - Combined claim workflow

### Pages & Components

- `app/claim/[username]/page.tsx` - Dedicated claim page
- `app/claim/[username]/components/ClaimAccountForm.tsx` - Claim form interface
- `app/claim/[username]/success/page.tsx` - Success confirmation page
- `app/[username]/components/ProfileHeader.tsx` - Shows claim button and badge

### API

- `app/api/clerkWebhook/route.ts` - Auto-finalizes claims when password is set

## Security Features

1. **Email Verification**: Only users with access to the account email can initiate claims
2. **Password Protection**: Claims require setting a new password through Clerk's secure reset flow
3. **Automatic Finalization**: Webhook ensures claims are completed when users set passwords
4. **Visual Indicators**: Clear UI feedback for unclaimed status

## Usage Notes

- Unclaimed accounts are created with `is_unclaimed: true` in both Clerk and Supabase
- The claim process leverages Clerk's built-in password reset security
- Once claimed, accounts function normally with no restrictions
- Failed claim attempts don't affect the account status

## Testing

To test the feature:

1. Create an unclaimed account through the existing flow
2. Visit the unclaimed user's profile page
3. Verify the "Unclaimed" badge and "Claim Account" button appear
4. Test the claim flow with the correct email address
5. Complete the password reset process
6. Verify the account is marked as claimed and fully accessible
