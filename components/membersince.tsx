import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileInfo({ user }: { user: any }) {
  const [memberSince, setMemberSince] = useState<string>("");

  // ✅ Fetch user's created_at date
 

  return (
    <div>
      <p>{memberSince || "Loading..."}</p>
    </div>
  );
}
