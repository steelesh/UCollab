import { AnimatedSpan, Terminal, TypingAnimation } from "~/components/magicui/terminal";
import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
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

export const metadata = {
  title: "UCollab — Contribution Guide",
};

export default function Page() {
  return (
    <Container as="article" size="4xl">
      <PageBreadcrumb
        items={[
          { label: "Contribution Guide", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Contribution Guide</H1>
        <P className="italic">UCollab thrives on contributions from developers, designers, and technical writers. Follow this guide to learn how to contribute effectively.</P>
      </Header>
      <Section>
        <Large>📌 How You Can Contribute</Large>
        <List>
          <ListItem>
            <strong>💡 Feature Development:</strong>
            {" "}
            Propose and implement new features.
          </ListItem>
          <ListItem>
            <strong>🐞 Bug Fixes:</strong>
            {" "}
            Identify and fix bugs in the platform.
          </ListItem>
          <ListItem>
            <strong>📖 Documentation:</strong>
            {" "}
            Improve guides, FAQs, and onboarding docs.
          </ListItem>
          <ListItem>
            <strong>🎨 UI/UX Design:</strong>
            {" "}
            Enhance user experience and accessibility.
          </ListItem>
        </List>
      </Section>
      <Section>
        <Large>🌿 Step 1: Fork & Clone the Repository</Large>
        <Muted>
          <Small>
            Start by
            {" "}
            <strong>forking</strong>
            {" "}
            the UCollab repository on GitHub.
          </Small>
        </Muted>
        <Terminal className="mt-4">
          <TypingAnimation delay={500}>git clone https://github.com/steelesh/UCollab.git</TypingAnimation>
          <AnimatedSpan delay={4000} className="text-green-500 select-none">
            <span>✔ Repository cloned successfully</span>
          </AnimatedSpan>
        </Terminal>
      </Section>
      <Section>
        <Large>🔃 Step 2: Create a New Branch</Large>
        <Muted>
          <Small>
            Always create a separate branch for each contribution:
          </Small>
        </Muted>
        <Terminal className="mt-4">
          <TypingAnimation delay={500}>git checkout -b feature-branch</TypingAnimation>
          <AnimatedSpan delay={3000} className="text-green-500 select-none">
            <span>✔ Switched to a new branch 'feature-branch'</span>
          </AnimatedSpan>
        </Terminal>
      </Section>
      <Section>
        <Large>🛠 Step 3: Make Your Changes</Large>
        <Muted>
          <Small>
            Follow UCollab's coding standards when implementing changes. Ensure your code is
            {" "}
            <strong>well-documented and tested</strong>
            {" "}
            before submitting.
          </Small>
        </Muted>
      </Section>
      <Section>
        <Large>📥 Step 4: Commit & Push</Large>
        <Muted>
          <Small>
            After making changes, commit and push them:
          </Small>
        </Muted>
        <Terminal className="mt-4">
          <TypingAnimation delay={500}>git add .</TypingAnimation>
          <AnimatedSpan delay={2500} className="text-green-500 select-none">
            <span>✔ Added all changes to staging</span>
          </AnimatedSpan>
        </Terminal>
        <Terminal className="mt-4">
          <TypingAnimation delay={500}>git commit -m "Brief description of changes"</TypingAnimation>
          <AnimatedSpan delay={3500} className="text-green-500 select-none">
            <span>✔ Committed changes with message</span>
          </AnimatedSpan>
        </Terminal>
        <Terminal className="mt-4">
          <TypingAnimation delay={500}>git push origin feature-branch</TypingAnimation>
          <AnimatedSpan delay={3500} className="text-green-500 select-none">
            <span>✔ Pushed changes to remote branch</span>
          </AnimatedSpan>
        </Terminal>
      </Section>
      <Section>
        <Large>✅ Step 5: Open a Pull Request</Large>
        <Muted>
          <Small>
            Open a
            {" "}
            <strong>pull request (PR)</strong>
            {" "}
            on GitHub to merge your changes.
          </Small>
        </Muted>
        <Muted className="mt-4">
          <Small>
            <TypographyLink href="https://github.com/steelesh/UCollab/pulls" isExternal>
              Open a pull request here
            </TypographyLink>
            .
          </Small>
        </Muted>
      </Section>
      <Section>
        <Large>📜 Contribution Best Practices</Large>
        <List>
          <ListItem>
            <strong>✅</strong>
            {" "}
            Write clean, well-structured code.
          </ListItem>
          <ListItem>
            <strong>✅</strong>
            {" "}
            Use meaningful commit messages.
          </ListItem>
          <ListItem>
            <strong>✅</strong>
            {" "}
            Ensure your changes do not break existing functionality.
          </ListItem>
          <ListItem>
            <strong>✅</strong>
            {" "}
            Follow the
            {" "}
            <TypographyLink href="/c/code-of-conduct">Code of Conduct</TypographyLink>
            .
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
