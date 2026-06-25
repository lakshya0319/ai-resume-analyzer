import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();
  const mutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await mutation.mutateAsync();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={mutation.isPending}>
      {mutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
