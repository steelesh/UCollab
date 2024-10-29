import Head from "next/head";
import Login from "@components/login";

export default function Home() {
  return (
    <>
      <Head>
        <title>UCollab — Home</title>
      </Head>
      <div className="flex w-full justify-center overflow-hidden rounded-lg shadow-lg">
        <Login />
      </div>
    </>
  );
}
