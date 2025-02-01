import { MicrosoftSignInButton } from "@/src/components/blocks/auth/microsoft-sign-in-button";
import { LargeText } from "@/src/components/ui/largetext";
import { List } from "@/src/components/ui/list";

export function DevInfoBanner() {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900/50 dark:bg-yellow-900/20">
      <LargeText className="font-heading text-yellow-800 dark:text-yellow-200">
        Authentication Options for Local Development
      </LargeText>
      <List className="mb-10 list-inside text-yellow-700 dark:text-yellow-300">
        <li>Use impersonation buttons below for testing different users</li>
        <li>
          Authenticate with UC Microsoft credentials (available to UC students,
          staff, and alumni)
        </li>
      </List>
      <div>
        <MicrosoftSignInButton />
      </div>
    </div>
  );
}
