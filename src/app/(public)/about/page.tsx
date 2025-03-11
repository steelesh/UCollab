"use client";
import { useState } from "react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Zachary Thomas",
      role: "Frontend & Backend Developer",
      bio: "I am a student at the University of Cincinnati with a passion for designing and programming software. In my free time, I enjoy hiking, making music, and photographing the places I travel to.",
      skills: "TypeScript, Rust, Python, web development, embedded systems programming.",
      contributions: "Helped create the UI and worked on backend development.",
      linkedin: "https://www.linkedin.com/in/thomasza92/"
    },
    {
      name: "Steele Shreve",
      role: "Full Stack Developer",
      bio: "I am a senior IT student at the University of Cincinnati. I enjoy building software, staying active with sports, traveling, and trying new things.",
      skills: "Backend programming with Go, end-to-end software delivery, software engineering experience from Milwaukee Tool and 183 Degrees.",
      contributions: "Worked on backend architecture, UI design, and hosting solutions, helping build multiple systems across the platform.",
      linkedin: "https://www.linkedin.com/in/steelesh/"
    },
    {
      name: "Nawrs Alfardous",
      role: "UX/UI Designer & Frontend Developer",
      bio: "I am a Cybersecurity student at the University of Cincinnati, graduating in May 2025. I enjoy UI/UX design and gained experience in the field while working with Trahum in Riyadh. I enjoy gaming and traveling.",
      skills: "Frontend development, UI/UX design, Cybersecurity, and IT support.",
      contributions: "Designed UCollab’s logo and contributed to frontend development to refine the platform’s UI.",
      linkedin: "https://www.linkedin.com/in/nawrs-alfardous-59a8301b3"
    },
    {
      name: "Paige Weitz",
      role: "Project Manager & Frontend Developer",
      bio: "I have been studying IT since 2021 and have been working in the industry since then. I currently work for American Financial Group in downtown Cincinnati, managing C-suite users and their technology. Alongside my studies, I am working towards multiple certifications, including the CompTIA trifecta, Cisco CCNA, and CAPM.",
      skills: "System administration, networking, project management, IT support.",
      contributions: "Managed project timelines, documentation, and scheduling, and also contributed to front-end development.",
      linkedin: "https://www.linkedin.com/in/paige-weitz-467b3520a/"
    },
    {
      name: "Luke Halverson",
      role: "Testing",
      bio: "I am a senior Cybersecurity student at the University of Cincinnati. I enjoy playing hockey, working out, and traveling. I have experience as a SOC Analyst intern, focusing on securing digital systems.",
      skills: "Cybersecurity, threat protection, digital security.",
      contributions: "Assisted in testing the implementation and development of multiple systems and functions.",
      linkedin: "https://www.linkedin.com/in/luke-halverson-38a4641b9"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <h1 className="text-center text-2xl font-bold select-none">About Us</h1>

      {/* Center-Aligned Introduction Section */}
      <div className="mt-8 max-w-3xl w-full bg-base-300 p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-lg font-semibold">Empowering Collaboration, Innovation, and Growth</h2>
        <p>
          UCollab is an open-source platform built by students for students. Our mission is to create a seamless space 
          where aspiring IT and Computer Science professionals can connect, collaborate, and gain real-world experience.
        </p>
      </div>

      {/* Meet the Team Section */}
      <h2 className="text-xl font-bold mt-12">🚀 Meet the Team</h2>
      <p className="text-center text-sm text-accent max-w-2xl mt-2">
        We are a team of passionate developers, designers, and problem-solvers committed to making collaboration more efficient.
      </p>

      {/* Single Card Display (Carousel) */}
      <div className="relative mt-8 w-full max-w-md flex justify-center">
        <div className="w-80 p-6 bg-base-300 shadow-2xl rounded-lg text-center">
          <h3 className="font-semibold text-xl text-accent">{teamMembers[activeIndex].name}</h3>
          <p className="text-sm font-medium text-darkgray-600 dark:text-gray-600">{teamMembers[activeIndex].role}</p>
          <p className="text-xs text-darkgray-700 dark:text-darkgray-300 mt-4">{teamMembers[activeIndex].bio}</p>
          <p className="text-xs mt-2"><strong>Skills:</strong> {teamMembers[activeIndex].skills}</p>
          <p className="text-xs mt-2"><strong>Contributions:</strong> {teamMembers[activeIndex].contributions}</p>
          <a href={teamMembers[activeIndex].linkedin} target="_blank" className="text-blue-600 text-xs mt-2 block">
            LinkedIn Profile
          </a>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="mt-6 flex space-x-2">
        {teamMembers.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === activeIndex ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setActiveIndex(index)}
          ></span>
        ))}
      </div>

      {/* Core Values Section */}
      <div className="mt-12 max-w-3xl w-full bg-base-300 p-8 rounded-lg shadow-2xl">
        <h2 className="text-lg font-semibold">🛠 Our Core Values</h2>
        <ul className="list-disc space-y-2 pl-5 mt-4 text-gray-600">
          <li><strong>🔹 Collaboration:</strong> We thrive in teamwork, ensuring that every contribution is valued.</li>
          <li><strong>🔹 Innovation:</strong> We embrace creativity and forward-thinking solutions.</li>
          <li><strong>🔹 Growth:</strong> Learning never stops, and we are committed to continuous development.</li>
          <li><strong>🔹 Open-Source Culture:</strong> Transparency and inclusivity define our approach to building technology.</li>
        </ul>
      </div>
    </div>
  );
}
