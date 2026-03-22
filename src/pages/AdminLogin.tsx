import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, session, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session && isAdmin) {
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(destination || "/admin/analytics", { replace: true });
    }
  }, [isAdmin, loading, location.state, navigate, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const nextError = await signIn(email, password);

    setSubmitting(false);
    if (nextError) {
      setError(nextError);
    }
  };

  return (
    <main className="min-h-screen bg-secondary text-primary-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="rounded-[2rem] border border-primary/20 bg-brand-dark-surface p-8 shadow-2xl shadow-primary/10 animate-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/75">
            <ShieldCheck className="h-4 w-4 text-brand-red" />
            Admin analytics
          </div>
          <h1 className="mt-6 max-w-xl font-display text-5xl leading-[0.95] text-primary-foreground sm:text-6xl">
            Referral platform analytics for True Trucking TV
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/70">
            Sign in with an admin account to view sensitive referral impression trends and compare traffic sources over time.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: "Daily", label: "Trend snapshots" },
              { value: "4", label: "Tracked platforms" },
              { value: "Secure", label: "Admin only" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-primary/10 bg-secondary px-5 py-4">
                <div className="font-display text-3xl text-brand-red">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.25em] text-primary-foreground/55">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <Card className="border-primary/20 bg-background text-foreground animate-reveal animate-reveal-delay-2">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Admin sign in</CardTitle>
            <CardDescription>Use an account that already has the admin role assigned.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                <LockKeyhole className="h-4 w-4" />
                {submitting ? "Signing in..." : "Open dashboard"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              Need the public site?{" "}
              <Link to="/" className="font-medium text-brand-red underline-offset-4 hover:underline">
                Return home
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminLogin;