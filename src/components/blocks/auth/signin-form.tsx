import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { MicrosoftSignInButton } from "./microsoft-sign-in-button";

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in with your University of Cincinnati credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <MicrosoftSignInButton />
            </div>
            <div className="text-muted-foreground text-center text-sm">
              Only available to University of Cincinnati students, staff, and
              alumni with valid UC credentials
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
