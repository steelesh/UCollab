import type { User } from "@prisma/client";
import type { Route } from "next";

import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import GraduationYearControl from "~/components/ui/gradyear-control";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { updateUser } from "~/features/users/user.actions";
import { prisma } from "~/lib/prisma";
import { withAuth } from "~/security/protected";

async function Page({ userId }: { userId: User["id"] }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatar: true,
      username: true,
      fullName: true,
      email: true,
      bio: true,
      createdDate: true,
      gradYear: true,
      mentorship: true,
      notificationPreferences: {
        select: {
          allowComments: true,
          allowMentions: true,
          allowPostUpdates: true,
          allowSystem: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <form action={updateUser} className="flex flex-col items-center">
      <input type="hidden" name="userId" value={userId} />
      <div className="w-full max-w-3xl rounded shadow">
        <div className="relative h-42">
          <Image src="/images/banner-placeholder.png" alt="Banner" fill className="rounded-t object-cover" />
          <div className="absolute -bottom-12 left-8">
            <Image
              src={user.avatar}
              alt={user.username}
              width={100}
              height={100}
              className="border-base-100 rounded-full border-5"
            />
          </div>
          <div className="absolute right-1 -bottom-12 flex space-x-2">
            <Link href={`/u/${user.username}` as Route}>
              <Button type="button" className="cursor-pointer" variant="outline" aria-label="Back">
                Back
              </Button>
            </Link>
            <Button
              type="submit"
              className="cursor-pointer bg-green-600 hover:bg-green-600/80"
              variant="outline"
              aria-label="Submit"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="px-8 pt-14 pb-8">
          <h1 className="pb-2 text-2xl font-bold">Settings</h1>
          <fieldset className="fieldset">
            <legend className="text-sm font-medium">Graduation Year</legend>
            <GraduationYearControl
              initialYear={user.gradYear ? String(user.gradYear) : undefined}
              currentYear={new Date().getFullYear()}
            />
          </fieldset>
          <div className="mt-4">
            <fieldset className="fieldset">
              <legend className="text-sm font-medium">Mentorship Status</legend>
              <div className="mt-2 flex gap-2 filter">
                <select name="mentorship" defaultValue={user.mentorship || "NONE"} className="bg-background">
                  <option value="MENTOR">Mentor</option>
                  <option value="MENTEE">Mentee</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </fieldset>
          </div>
          <div className="mt-4">
            <fieldset className="fieldset">
              <legend className="text-sm font-medium">Biography</legend>
              <Textarea
                name="bio"
                className="textarea h-24"
                placeholder="Tell everyone a little bit about yourself!"
                defaultValue={user.bio || ""}
              >
              </Textarea>
            </fieldset>
          </div>
          <div className="mt-4">
            <fieldset className="fieldset grid w-full max-w-sm items-center">
              <legend className="text-sm font-medium">Avatar</legend>
              <Input type="file" name="avatar" accept="image/*" className="file-input" />
            </fieldset>
          </div>
          <div className="mt-8">
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="text-sm font-medium">Notifications</legend>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowComments"
                  defaultChecked={user.notificationPreferences?.allowComments}
                  className="toggle"
                />
                Comments
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowMentions"
                  defaultChecked={user.notificationPreferences?.allowMentions}
                  className="toggle"
                />
                Mentions
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowPostUpdates"
                  defaultChecked={user.notificationPreferences?.allowPostUpdates}
                  className="toggle"
                />
                Posts
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowSystem"
                  defaultChecked={user.notificationPreferences?.allowSystem}
                  className="toggle"
                />
                System
              </label>
            </fieldset>
          </div>
        </div>
      </div>
    </form>
  );
}

export default withAuth(Page);
