"use client";

import { useState } from "react";

export function BroadcastForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<
    { type: "success"; text: string } | { type: "error"; text: string } | null
  >(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setSending(true);

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);

      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("");
        setSubject("");
        const failedNote = data.failed ? ` (${data.failed} failed)` : "";
        setStatus({ type: "success", text: `Sent to ${data.sent} of ${data.total} subscribers${failedNote}.` });
      } else {
        setStatus({ type: "error", text: data.error ?? "Failed to send." });
      }
    } catch {
      setStatus({ type: "error", text: "Could not reach the server. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="broadcastForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Subject (optional)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Write a message to send to everyone on the list…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        required
      />
      <button type="submit" className="applyButton" disabled={sending}>
        {sending ? "Sending…" : "Send to all subscribers"}
      </button>
      {status && (
        <p className={`statusBox ${status.type === "success" ? "statusSuccess" : "statusError"}`}>
          {status.text}
        </p>
      )}
    </form>
  );
}
