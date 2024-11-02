import Head from "next/head";

export default function Accessibility() {
  return (
    <>
      <Head>
        <title>UCollab — License</title>
      </Head>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <div className="card mt-10 bg-base-300 p-8 shadow-2xl">
          <h1 className="select-none text-center text-2xl font-bold">
            License Agreement
          </h1>
        </div>
      </div>
    </>
  );
}
