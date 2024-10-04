import Head from "next/head";

export default function Home() {
  const courses = [
    { name: "CYBERSECURITY POL", term: "Fall 2024", endAt: "2024-12-15" },
    { name: "PENETRATION TESTING", term: "Fall 2024", endAt: "2024-12-15" },
    { name: "SR CAPSTONE PROJECT I", term: "Fall 2024", endAt: "2024-12-15" },
  ];
  return (
    <>
      <Head>
        <title>UCollab</title>
        <meta name="description" content="For students, by students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#1a1a1a]">
        <div className="container mx-auto px-4 py-10">
          <h1 className="mb-10 text-5xl font-extrabold tracking-tight">
            <span className="inline-block origin-center transform transition-transform duration-300 hover:scale-110">
              <span className="text-[#e00122]">UC</span>
              <span className="text-white">ollab</span>
            </span>
          </h1>
          <div className="flex w-full justify-center overflow-hidden rounded-lg bg-[#212121] text-white shadow-lg">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-[#171717] text-white">
                  <th className="px-6 py-4">Course Name</th>
                  <th className="px-6 py-4">Term</th>
                  <th className="px-6 py-4">End Date</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr
                    key={idx}
                    className={`transition duration-300 ease-in-out hover:bg-[#343434] ${
                      idx % 2 === 0
                    }`}
                  >
                    <td className="px-6 py-4">{course.name}</td>
                    <td className="px-6 py-4">{course.term}</td>
                    <td className="px-6 py-4">
                      {new Date(course.endAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
