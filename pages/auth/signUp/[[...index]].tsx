import { SignUp } from "@clerk/nextjs";

const SignInPage = () => (
  <SignUp path="/auth/signUp" routing="path" signInUrl="/auth/signIn" />
);

export default SignInPage;
