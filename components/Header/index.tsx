import { SpotlightNavigation } from "./Nav";
import HeaderLink from "./HeaderLink";

export default function Header() {
  return (
    <div className="w-screen fixed top-6 px-16 flex flex-row items-center justify-end z-[999]">
      <SpotlightNavigation />
      <div className="flex flex-row gap-3">
        <HeaderLink text="Sign Up" href="/sign-up" />
        <HeaderLink text="Subscribe" href="/subscribe" inverted />
      </div>
    </div>
  );
}
