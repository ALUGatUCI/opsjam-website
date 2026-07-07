"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append("password", password);

      const response = await fetch("/api/admin-login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setPassword("");
        // Re-render the server component so the cookie gate re-runs.
        router.refresh();
      } else {
        setError((await response.json()).error ?? "Login failed.");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    }
  }

  return (
    <form className="mailingList" onSubmit={handleSubmit}>
      <input
        type="password"
        name="password"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="applyButton">
        Sign in
      </button>
      {error && <p className="statusBox statusError">{error}</p>}
    </form>
  );
}
