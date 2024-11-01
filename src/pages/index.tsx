import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>UCollab — Home</title>
      </Head>
      <h1>Home</h1>
      <a href="/protected" className="btn btn-primary mt-6">
        Protected Page
      </a>
      <p>^to test auth</p>
    </>
  );
}
