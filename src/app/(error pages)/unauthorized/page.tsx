import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { P } from "@/src/components/ui/p";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <ShieldAlert className="text-destructive h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center">
          <P>You don&apos;t have permission to access this page.</P>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="default">
            <Link href="/">Return Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
