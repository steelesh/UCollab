"use client";
import { useState } from "react";

import { Button } from "~/components/ui/button";

export default function Page() {
  const teamMembers = [
    {
      name: "Zachary Thomas",
      role: "Frontend & Backend Developer",
      bio: "I am a student at the University of Cincinnati with a passion for designing and programming software. In my free time, I enjoy hiking, making music, and photographing the places I travel to.",
      skills: "TypeScript, Rust, Python, web development, embedded systems programming.",
      contributions: "Helped create the UI and worked on backend development.",
      linkedin: "https://www.linkedin.com/in/thomasza92/",
    },
    {
      name: "Steele Shreve",
      role: "Full Stack Developer",
      bio: "I am a senior IT student at the University of Cincinnati. I enjoy building software, staying active with sports, traveling, and trying new things.",
      skills:
        "Backend programming with Go, end-to-end software delivery, software engineering experience from Milwaukee Tool and 183 Degrees.",
      contributions:
        "Worked on backend architecture, UI design, and hosting solutions, helping build multiple systems across the platform.",
      linkedin: "https://www.linkedin.com/in/steelesh/",
    },
    {
      name: "Nawrs Alfardous",
      role: "UX/UI Designer & Frontend Developer",
      bio: "I am a Cybersecurity student at the University of Cincinnati, graduating in May 2025. I enjoy UI/UX design and gained experience in the field while working with Trahum in Riyadh. I enjoy gaming and traveling.",
      skills: "Frontend development, UI/UX design, Cybersecurity, and IT support.",
      contributions: "Designed UCollab's logo and contributed to frontend development to refine the platform's UI.",
      linkedin: "https://www.linkedin.com/in/nawrs-alfardous-59a8301b3",
    },
    {
      name: "Paige Weitz",
      role: "Project Manager & Frontend Developer",
      bio: "I have been studying IT since 2021 and have been working in the industry since then. I currently work for American Financial Group in downtown Cincinnati, managing C-suite users and their technology. Alongside my studies, I am working towards multiple certifications, including the CompTIA trifecta, Cisco CCNA, and CAPM.",
      skills: "System administration, networking, project management, IT support.",
      contributions:
        "Managed project timelines, documentation, and scheduling, and also contributed to front-end development.",
      linkedin: "https://www.linkedin.com/in/paige-weitz-467b3520a/",
    },
    {
      name: "Luke Halverson",
      role: "Testing",
      bio: "I am a senior Cybersecurity student at the University of Cincinnati. I enjoy playing hockey, working out, and traveling. I have experience as a SOC Analyst intern, focusing on securing digital systems.",
      skills: "Cybersecurity, threat protection, digital security.",
      contributions: "Assisted in testing the implementation and development of multiple systems and functions.",
      linkedin: "https://www.linkedin.com/in/luke-halverson-38a4641b9",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-2xl font-bold select-none">About Us</h1>
      <h2 className="mt-8 text-xl font-bold">🚀 Meet the Team</h2>
      <p className="text-secondary mt-2 max-w-2xl text-center text-sm italic">
        We are a team of passionate developers, designers, and problem-solvers committed to making collaboration more
        efficient.
      </p>
      <div className="relative mt-8 flex w-full justify-center">
        <div
          className="text-secondary-foreground mt-4 list-disc space-y-2 rounded-lg pl-5 text-left shadow-2xl"
          style={{ maxWidth: "calc(50vw" }}
        >
          <h3 className="text-secondary-foreground text-xl font-semibold">{teamMembers[activeIndex]?.name}</h3>
          <p className="text-secondary text-sm font-medium">{teamMembers[activeIndex]?.role}</p>
          <p className="text-secondary-foreground mt-4 text-sm">{teamMembers[activeIndex]?.bio}</p>
          <p className="mt-2 text-sm">
            <strong>Skills:</strong>
            {" "}
            {teamMembers[activeIndex]?.skills}
          </p>
          <p className="mt-2 text-sm">
            <strong>Contributions:</strong>
            {" "}
            {teamMembers[activeIndex]?.contributions}
          </p>
          <a
            href={teamMembers[activeIndex]?.linkedin}
            target="_blank"
            className="text-secondary mt-2 block text-sm underline"
          >
            LinkedIn Profile
          </a>
        </div>
      </div>
      <div className="my-6 flex space-x-2">
        {teamMembers.map((member, index) => (
          <Button
            key={member.name}
            className={`h-3 w-3 cursor-pointer rounded-full ${index === activeIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => setActiveIndex(index)}
          >
          </Button>
        ))}
      </div>
      <div className="mt-8 w-full max-w-3xl rounded-lg shadow-2xl" style={{ maxWidth: "calc(50vw" }}>
        <h2 className="text-lg font-semibold">🛠 Our Core Values</h2>
        <ul className="text-secondary-foreground mt-4 list-disc space-y-2 pl-5">
          <ul>
            <strong>♦️ Collaboration:</strong>
            {" "}
            We thrive in teamwork, ensuring that every contribution is valued.
          </ul>
          <ul>
            <strong>♦️ Innovation:</strong>
            {" "}
            We embrace creativity and forward-thinking solutions.
          </ul>
          <ul>
            <strong>♦️ Growth:</strong>
            {" "}
            Learning never stops, and we are committed to continuous development.
          </ul>
          <ul>
            <strong>♦️ Open-Source Culture:</strong>
            {" "}
            Transparency and inclusivity define our approach to building
            technology.
          </ul>
        </ul>
      </div>
    </div>
  );
}
