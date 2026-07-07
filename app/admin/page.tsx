import { cookies } from "next/headers";

import databaseService from "@/services/supabase";
import { LoginForm } from "./LoginForm";
import { LogoutButton } from "./LogoutButton";
import { BroadcastForm } from "./BroadcastForm";
// Loaded here (the always-rendered route page) so the shared .statusBox styles
// are available in every branch, regardless of which child components render.
import "../../components/mailingList.css";
import "./style.css";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const store = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  // Only treat the request as authed when a configured password exists AND the
  // httpOnly cookie matches it. No password configured => always locked.
  const authed = Boolean(expected) && store.get("admin_auth")?.value === expected;

  if (!authed) {
    return (
      <main className="adminCard">
        <span className="adminBadge">Restricted</span>
        <h1>Admin</h1>
        <p>Enter the admin password to continue.</p>
        <LoginForm />
      </main>
    );
  }

  // Authed: load the mailing list for display. Read-only — the dashboard shows
  // it but offers no way to edit it.
  let emails: string[] = [];
  let listError = false;
  try {
    emails = await databaseService.getMailingList();
  } catch {
    listError = true;
  }

  return (
    <main className="adminCard dashboard">
      <div className="adminHeader">
        <div>
          <span className="adminBadge">Signed in</span>
          <h1>Admin</h1>
        </div>
        <LogoutButton />
      </div>

      <section className="adminSection">
        <h2>
          Mailing list
          {!listError && <span className="adminCount">{emails.length}</span>}
        </h2>
        {listError ? (
          <p className="statusBox statusError">Could not load the mailing list.</p>
        ) : emails.length === 0 ? (
          <p>No one has subscribed yet.</p>
        ) : (
          <ul className="emailList">
            {emails.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="adminSection">
        <h2>Email everyone</h2>
        {process.env.ENABLE_BROADCAST === "1" ? (
          <>
            <p>Sends your message to all {emails.length} subscribers as individual emails.</p>
            <BroadcastForm />
          </>
        ) : (
          <p>Email sending is disabled. Set <code>ENABLE_BROADCAST=1</code> to turn it on.</p>
        )}
      </section>
    </main>
  );
}
