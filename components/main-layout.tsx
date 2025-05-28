import { Lenis } from "lenis/react";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative max-w-[100vw] layout-wrapper overflow-x-hidden">
      <Lenis root />
      <Header />
      {children}
      <BottomNav />
    </div>
  );
}
