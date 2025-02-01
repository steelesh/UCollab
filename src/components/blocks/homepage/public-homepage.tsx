import { isDevelopment } from "@/src/lib/utils";
import Link from "next/link";
import { H3 } from "../../ui/h3";
import { P } from "../../ui/p";

export function PublicHomePage() {
  return (
    <div>
      <H3>Welcome to UCollab</H3>
      <P>
        <Link href={isDevelopment() ? "/u" : "/signin"}>Sign in</Link> to access
        your personalized dashboard.
      </P>
    </div>
  );
}
