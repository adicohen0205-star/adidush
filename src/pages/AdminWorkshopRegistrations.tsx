import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Registration {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  workshop_id: string;
  workshop_title: string;
  workshop_date: string;
  participants_count: number;
  total_price: number;
  payment_status: string;
}

const AdminWorkshopRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      const { data, error } = await supabase
        .from("workshop_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRegistrations(data as Registration[]);
      }
      setLoading(false);
    };
    fetchRegistrations();
  }, []);

  const filtered = registrations.filter(
    (r) =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.workshop_title.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 text-white">שולם</Badge>;
      case "pending":
        return <Badge variant="secondary">ממתין</Badge>;
      default:
        return <Badge variant="destructive">{status}</Badge>;
    }
  };

  return (
    <div dir="rtl" className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-rubik font-bold mb-6">הרשמות לסדנאות</h1>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="חיפוש לפי שם, אימייל או סדנה..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">טוען...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">אין הרשמות עדיין.</p>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם</TableHead>
                <TableHead className="text-right">אימייל</TableHead>
                <TableHead className="text-right">טלפון</TableHead>
                <TableHead className="text-right">סדנה</TableHead>
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">משתתפים</TableHead>
                <TableHead className="text-right">סה״כ</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תאריך הרשמה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.full_name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell dir="ltr" className="text-right">{r.phone}</TableCell>
                  <TableCell>{r.workshop_title}</TableCell>
                  <TableCell>{r.workshop_date}</TableCell>
                  <TableCell>{r.participants_count}</TableCell>
                  <TableCell>₪{r.total_price}</TableCell>
                  <TableCell>{statusBadge(r.payment_status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("he-IL")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminWorkshopRegistrations;
