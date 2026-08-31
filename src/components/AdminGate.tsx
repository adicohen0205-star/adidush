import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminGateProps {
  title: string;
  children: ReactNode;
}

/**
 * Wraps the admin pages in a real Supabase Auth session.
 *
 * Replaces the previous client-side password check, which shipped the
 * password in the JS bundle. Access to the underlying data is enforced
 * by row level security (public.is_admin()), so this form is only the
 * front door, not the lock.
 */
const AdminGate = ({ title, children }: AdminGateProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const resolve = async (next: Session | null) => {
      if (!next) {
        if (active) {
          setSession(null);
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }
      const { data, error: rpcError } = await supabase.rpc("is_admin");
      if (!active) return;
      setSession(next);
      setIsAdmin(!rpcError && data === true);
      setChecking(false);
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setChecking(true);
      resolve(next);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("אימייל או סיסמה שגויים");
    }
    setPassword("");
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (checking) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">טוען...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background">
        <form
          onSubmit={handleLogin}
          className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-4 w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-center text-foreground">{title}</h1>
          <input
            type="email"
            placeholder="אימייל"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-right"
          />
          <input
            type="password"
            placeholder="סיסמה"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-right"
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-60"
          >
            {submitting ? "מתחבר..." : "כניסה"}
          </button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-4 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-foreground">אין הרשאה</h1>
          <p className="text-muted-foreground">
            החשבון הזה אינו מוגדר כמנהל.
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium"
          >
            התנתקות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground underline shrink-0"
          >
            התנתקות
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminGate;
