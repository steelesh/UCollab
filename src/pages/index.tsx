import Head from "next/head";
import Login from "@components/login";

export default function Home() {
  return (
    <>
      <Head>
        <title>UCollab — Home</title>
      </Head>
      <Login />
    </>
  );
}
