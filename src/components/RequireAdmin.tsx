import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const RequireAdmin = () => {
  const { loading, session, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4 text-primary-foreground">
        <div className="animate-pulse text-sm font-medium uppercase tracking-[0.25em] text-primary-foreground/70">
          Checking admin access
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
        <Card className="w-full max-w-lg border-primary/20 bg-background">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Admin access required</CardTitle>
            <CardDescription>
              This dashboard contains sensitive analytics and is only available to accounts with the admin role.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="hero" onClick={() => void signOut()}>
              Sign out
            </Button>
            <Button variant="outline" asChild>
              <a href="/">Back to site</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Outlet />;
};

export default RequireAdmin;