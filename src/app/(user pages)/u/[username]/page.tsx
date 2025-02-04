import { P } from "@/src/components/ui/p";
import { withAuth } from "@/src/lib/auth/protected";

async function Page() {
  return (
    <div className="p-4">
      <P>-- show user profile here --</P>
    </div>
  );
}

export default withAuth(Page);
