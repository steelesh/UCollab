import { signIn } from "next-auth/react";
import Head from "next/head";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default function Signin() {
  const handleSignIn = () => {
    const callbackUrl =
      new URLSearchParams(window.location.search).get("callbackUrl") ?? "/";
    void signIn("azure-ad", { callbackUrl });
  };

  return (
    <>
      <Head>
        <title>UCollab — Sign In</title>
      </Head>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <div className="card mt-10 bg-base-300 p-8 shadow-2xl">
          <h1 className="mb-6 select-none text-center text-2xl font-bold">
            Sign In
          </h1>
          <div className="flex justify-center">
            <button
              className="btn btn-primary select-none"
              onClick={handleSignIn}
            >
              Sign in with UC Credentials
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
