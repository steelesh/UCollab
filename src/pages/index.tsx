import Head from "next/head";
import Navbar from "../components/navbar";
import Login from "../components/login";

export default function Home() {
  return (
    <>
      <Head>
        <title>UCollab</title>
        <meta name="description" content="For students, by students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <Navbar />
        <div className="flex w-full justify-center overflow-hidden rounded-lg shadow-lg">
          <Login />
        </div>
      </main>
    </>
  );
}
