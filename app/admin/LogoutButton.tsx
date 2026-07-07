"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    // Clears the admin_auth cookie server-side, then re-runs the page's gate.
    await fetch("/api/admin-login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <button type="button" className="applyButton" onClick={handleLogout}>
      Log out
    </button>
  );
}
