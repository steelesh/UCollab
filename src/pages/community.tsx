import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { type GetServerSideProps } from "next";
import { db } from "~/server/db";

interface User {
  image: string | null;
  username: string;
  email: string;
  createdDate: string;
  lastLogin: string;
  verifiedEmail: boolean;
}

interface CommunityProps {
  users: User[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await db.user.findMany({
    select: {
      image: true,
      username: true,
      email: true,
      createdDate: true,
      lastLogin: true,
      verifiedEmail: true,
    },
  });

  return {
    props: {
      users: users.map(user => ({
        ...user,
        createdDate: user.createdDate.toISOString().split("T")[0],
        lastLogin: user.lastLogin.toISOString().split("T")[0],
      })),
    },
  };
};

export default function Community({ users }: CommunityProps) {
  return (
    <>
      <Head>
        <title>UCollab — Community</title>
      </Head>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center p-4 border-b w-full max-w-3xl"
          >
            <Image
              src={user.image ?? "https://avatar.iran.liara.run/public"} // Path to default avatar
              alt={user.username}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="ml-4">
              <Link href={`/@${user.username}`} className="font-bold hover:underline">
                {user.username}
              </Link>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm">Created: {user.createdDate}</p>
              <p className="text-sm">Last Login: {user.lastLogin}</p>
              <p className="text-sm">
                Verified: {user.verifiedEmail ? "Yes" : "No"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
