import { SpotlightNavigation } from "./Nav";
import Link from "next/link";

function HeaderLink({ text, href }: { text: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-black text-white px-10 py-3 rounded-full tracking-tight text-lg"
    >
      {text}
    </Link>
  );
}

export default function Header() {
  return (
    <div>
      <SpotlightNavigation />
      <div className="fixed top-6 right-16">
        <HeaderLink text="Sign In" href="/sign-in" />
      </div>
    </div>
  );
}
