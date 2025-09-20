# Stripe Setup Guide

This guide will help you set up Stripe subscriptions for your Spotlight application.

## 1. Stripe Account Setup

1. **Create a Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: Go to Developers > API keys in your Stripe dashboard
   - Copy your **Publishable key** and **Secret key**
   - Use test keys for development (they start with `pk_test_` and `sk_test_`)

## 2. Create a Product and Price

1. **Go to Products**: In your Stripe dashboard, navigate to Products
2. **Create Product**:
   - Name: "Premium Plan" (or your preferred name)
   - Description: "Premium subscription for Spotlight"
3. **Add Pricing**:
   - Price: $3.88 (or your preferred amount)
   - Billing period: Monthly
   - Currency: USD
4. **Copy Price ID**: After creating, copy the Price ID (starts with `price_`)

## 3. Environment Variables

Add these to your `.env.local` file:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_PRICE_ID=price_your_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App URL (update for production)
NEXT_PUBLIC_URL=http://localhost:3000
```

## 4. Database Setup

Add the subscriptions table to your Supabase database:

```sql
-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Create function to check if user is premium
CREATE OR REPLACE FUNCTION is_user_premium(user_id_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = user_id_param
    AND status = 'active'
    AND current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql;
```

## 5. Webhook Setup

1. **Create Webhook Endpoint**: In Stripe dashboard, go to Developers > Webhooks
2. **Add endpoint**: `https://yourdomain.com/api/stripe/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy Webhook Secret**: Copy the webhook signing secret (starts with `whsec_`)

## 6. Testing

1. **Test Mode**: Use Stripe's test mode for development
2. **Test Cards**: Use Stripe's test card numbers:
   - Success: `4242424242424242`
   - Declined: `4000000000000002`
3. **Local Testing**: Use Stripe CLI for local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## 7. Production Deployment

1. **Live Keys**: Replace test keys with live keys in production
2. **Webhook URL**: Update webhook endpoint to your production domain
3. **Environment Variables**: Update `NEXT_PUBLIC_URL` to your production domain

## Features Included

✅ **Subscription Creation**: Users can subscribe via Stripe Checkout
✅ **Webhook Handling**: Automatic subscription status updates
✅ **Premium Status**: Check if user has active subscription
✅ **Success Page**: Post-subscription confirmation
✅ **Database Integration**: Subscription data stored in Supabase
✅ **Authentication**: Integrated with Clerk authentication

## API Endpoints

- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Utility Functions

- `isUserPremium(userId)` - Check if user has active subscription
- `getCurrentUserPremiumStatus()` - Get current user's subscription status
- `requirePremium()` - Server-side premium requirement check

## Next Steps

1. Set up the database table
2. Configure your Stripe webhook
3. Test the subscription flow
4. Deploy to production with live keys
