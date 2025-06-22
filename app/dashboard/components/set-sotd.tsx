"use client";

import { cn } from "@/lib/utils";
import { useSession } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSotd } from "@/lib/supabase/sotd-action";

export default function SetSotd({
  projectId,
  isSotd,
}: {
  projectId: number;
  isSotd: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const handleSetSotd = async () => {
    try {
      setIsLoading(true);
      await setSotd(projectId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    router.refresh();
  };

  return (
    <button
      disabled={isLoading || isSotd}
      className={cn(
        "bg-black text-white px-4 py-2 rounded-md",
        isSotd && "bg-green-500"
      )}
      onClick={handleSetSotd}
    >
      {isLoading ? "Setting..." : isSotd ? "Current SotD" : "Set as SotD"}
    </button>
  );
}
