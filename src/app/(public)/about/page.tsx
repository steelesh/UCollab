"use client";

import { useState } from "react";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Large } from "~/components/ui/large";
import { TypographyLink } from "~/components/ui/link";
import { List, ListItem } from "~/components/ui/list";
import { Muted } from "~/components/ui/muted";
import { P } from "~/components/ui/p";
import { Section } from "~/components/ui/section";
import { Small } from "~/components/ui/small";

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
    <Container as="article" size="4xl">
      <PageBreadcrumb
        items={[
          { label: "About Us", isCurrent: true },
        ]}
      />
      <Header>
        <H1>About Us</H1>
        <Muted>
          We are a team of passionate developers, designers, and problem-solvers committed to making collaboration more efficient.
        </Muted>
      </Header>
      <Section>
        <Large>🚀 Meet the Team</Large>
        <div className="relative mt-8">
          <Card variant="glossy" className="w-full h-[600px]">
            <CardHeader>
              <CardTitle className="text-xl">{teamMembers[activeIndex]?.name}</CardTitle>
              <Muted>{teamMembers[activeIndex]?.role}</Muted>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <P>{teamMembers[activeIndex]?.bio}</P>
                <div>
                  <strong>Skills:</strong>
                  <P>{teamMembers[activeIndex]?.skills}</P>
                </div>
                <div>
                  <strong>Contributions:</strong>
                  <P>{teamMembers[activeIndex]?.contributions}</P>
                </div>
              </div>
              <div className="mt-10">
                <TypographyLink href={teamMembers[activeIndex]?.linkedin ?? "#"} isExternal>
                  LinkedIn Profile
                </TypographyLink>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="my-6 flex space-x-2">
          {teamMembers.map((member, index) => (
            <Button
              key={member.name}
              className={`h-3 w-3 cursor-pointer rounded-full ${index === activeIndex ? "bg-primary" : "bg-muted"}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </Section>
      <Section>
        <Large>🛠 Our Core Values</Large>
        <List>
          <ListItem>
            <strong>♦️ Collaboration:</strong>
            {" "}
            We thrive in teamwork, ensuring that every contribution is valued.
          </ListItem>
          <ListItem>
            <strong>♦️ Innovation:</strong>
            {" "}
            We embrace creativity and forward-thinking solutions.
          </ListItem>
          <ListItem>
            <strong>♦️ Growth:</strong>
            {" "}
            Learning never stops, and we are committed to continuous development.
          </ListItem>
          <ListItem>
            <strong>♦️ Open-Source Culture:</strong>
            {" "}
            Transparency and inclusivity define our approach to building technology.
          </ListItem>
        </List>
      </Section>
      <Section className="text-center mt-20">
        <Muted>
          <Small>
            Have questions? Reach out at
            {" "}
            <TypographyLink href="mailto:support@ucollab.com">support@ucollab.com</TypographyLink>
            .
          </Small>
        </Muted>
      </Section>
    </Container>
  );
}
