import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminGate from "@/components/AdminGate";
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

const InquiriesTable = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      // Read directly from the table. Row level security (is_admin())
      // is what actually authorises this, so no service_role key is
      // involved anywhere in the browser.
      const { data, error } = await supabase
        .from("business_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInquiries(data as Inquiry[]);
      }
      setLoading(false);
    };
    fetchInquiries();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">טוען...</p>;
  }

  if (inquiries.length === 0) {
    return <p className="text-muted-foreground">אין פניות עדיין</p>;
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto">
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
              <TableCell className="text-right whitespace-nowrap">
                {format(new Date(inq.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell className="text-right">{inq.name}</TableCell>
              <TableCell className="text-right">
                <a href={`mailto:${inq.email}`} className="text-primary underline">
                  {inq.email}
                </a>
              </TableCell>
              <TableCell className="text-right">{inq.phone || "—"}</TableCell>
              <TableCell className="text-right max-w-xs">{inq.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const AdminInquiries = () => (
  <AdminGate title="פניות עסקיות">
    <InquiriesTable />
  </AdminGate>
);

export default AdminInquiries;
