import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Simple password protection (not secure for production, but functional)
  const ADMIN_PASS = "adi2025";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    const fetchInquiries = async () => {
      // Use service role via edge function to read inquiries
      const { data, error } = await supabase.functions.invoke("get-inquiries");
      if (!error && data) {
        setInquiries(data);
      }
      setLoading(false);
    };
    fetchInquiries();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-4 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-foreground">ניהול פניות</h1>
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-right"
          />
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium">
            כניסה
          </button>
        </form>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">פניות עסקיות</h1>
        {loading ? (
          <p className="text-muted-foreground">טוען...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-muted-foreground">אין פניות עדיין</p>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">אימייל</TableHead>
                  <TableHead className="text-right">טלפון</TableHead>
                  <TableHead className="text-right">הודעה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inq) => (
                  <TableRow key={inq.id}>
                    <TableCell className="text-right whitespace-nowrap">{format(new Date(inq.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell className="text-right">{inq.name}</TableCell>
                    <TableCell className="text-right">
                      <a href={`mailto:${inq.email}`} className="text-primary underline">{inq.email}</a>
                    </TableCell>
                    <TableCell className="text-right">{inq.phone || "—"}</TableCell>
                    <TableCell className="text-right max-w-xs">{inq.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
