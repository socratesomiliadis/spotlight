"use client";

import { HTMLMotionProps, motion } from "motion/react";
import { usePathname } from "next/navigation";

const PageWrapper = (props: HTMLMotionProps<"div">) => {
  const pathname = usePathname();
  return (
    <div>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        {...props}
      />
    </div>
  );
};

export default PageWrapper;
