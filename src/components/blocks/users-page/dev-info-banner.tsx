import { MicrosoftSignInButton } from "@/src/components/blocks/auth/microsoft-sign-in-button";
import { LargeText } from "@/src/components/ui/largetext";
import { List } from "@/src/components/ui/list";

export function DevInfoBanner() {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900/50 dark:bg-yellow-900/20">
      <LargeText className="font-heading text-yellow-800 dark:text-yellow-200">
        <span className="text-red-500">*</span> Local Development Information
      </LargeText>
      <List className="mb-10 list-inside text-yellow-700 dark:text-yellow-300">
        <li>This page displays test users for development purposes</li>
        <li>
          You can impersonate users by clicking or pressing enter on the
          &quot;Impersonate&quot; button
        </li>
        <li>
          Microsoft Entra ID Sign-in is only available for University of
          Cincinnati MS Entra tenant users
        </li>
      </List>
      <div>
        <MicrosoftSignInButton />
      </div>
    </div>
  );
}
