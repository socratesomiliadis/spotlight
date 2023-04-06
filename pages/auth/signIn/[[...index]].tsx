import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <SignIn path="/auth/signIn" routing="path" signUpUrl="/auth/signUp" />
);

export default SignInPage;
