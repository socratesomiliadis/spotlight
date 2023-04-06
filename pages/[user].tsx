import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = router.query;
  const clerk = useClerk();

  return (
    <div>
      <h1>Profile page for {user}</h1>
    </div>
  );
}
