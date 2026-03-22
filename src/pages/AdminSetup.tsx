import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminSetup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, user, isAdmin, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin");

      if (error) throw new Error(error.message);
      return count ?? 0;
    },
  });

  const handleBootstrap = async () => {
    if (!user) return;

    setSubmitting(true);
    setMessage(null);

    const { data, error } = await supabase.rpc("bootstrap_first_admin", { _user_id: user.id });

    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data) {
      setMessage("An admin already exists, so bootstrap is no longer available.");
      await queryClient.invalidateQueries({ queryKey: ["admin-count"] });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["admin-count"] });
    setMessage("Admin access granted. Redirecting to dashboard...");
    window.location.assign("/admin/analytics");
  };

  if (!loading && isAdmin) {
    navigate("/admin/analytics", { replace: true });
  }

  return (
    <main className="min-h-screen bg-secondary text-primary-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10">
        <Card className="w-full border-primary/20 bg-brand-dark-surface text-primary-foreground shadow-2xl shadow-primary/10 animate-reveal">
          <CardHeader className="space-y-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/75">
              <Shield className="h-4 w-4 text-brand-red" />
              First admin setup
            </div>
            <CardTitle className="font-display text-5xl leading-[0.95]">Seed the first admin account</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7 text-primary-foreground/65">
              This one-time flow gives the signed-in account admin access only if no admin exists yet. Once an admin has been created, this setup route locks automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-primary/15 bg-secondary p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Current account</p>
              <p className="mt-3 text-lg text-primary-foreground">{session?.user.email ?? "Sign in required"}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-primary/10 bg-brand-dark-surface px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/45">Admins found</p>
                  <p className="mt-2 font-display text-4xl text-primary-foreground">
                    {isLoading ? "…" : (data ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-brand-dark-surface px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/45">Bootstrap status</p>
                  <p className="mt-2 font-display text-2xl text-brand-red">{(data ?? 0) === 0 ? "Available" : "Locked"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-primary/15 bg-background p-6 text-foreground">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-brand-red">
                <Sparkles className="h-4 w-4" />
                Safe first-admin bootstrap
              </div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>• Requires a signed-in account</li>
                <li>• Works only when the project has zero admins</li>
                <li>• Locks automatically after the first admin is assigned</li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => void handleBootstrap()}
                  disabled={!session || submitting || (data ?? 0) > 0}
                >
                  {submitting ? "Seeding admin..." : "Make this account admin"}
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/admin/login">Back to admin login</Link>
                </Button>
              </div>

              {!session ? <p className="mt-4 text-sm text-destructive">Sign in first, then come back to seed the first admin.</p> : null}
              {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminSetup;