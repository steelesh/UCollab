import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { CodeBlock } from "~/components/ui/code-block";
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
    <Container as="article">
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
        <P>
          <Small>
            Start by
            {" "}
            <strong>forking</strong>
            {" "}
            the UCollab repository on GitHub.
          </Small>
        </P>
        <CodeBlock>
          git clone https://github.com/steelesh/UCollab.git
        </CodeBlock>
      </Section>
      <Section>
        <Large>🔃 Step 2: Create a New Branch</Large>
        <P>
          <Small>
            Always create a separate branch for each contribution:
          </Small>
        </P>
        <CodeBlock>
          git checkout -b feature-branch
        </CodeBlock>
      </Section>
      <Section>
        <Large>🛠 Step 3: Make Your Changes</Large>
        <P>
          <Small>
            Follow UCollab's coding standards when implementing changes. Ensure your code is
            {" "}
            <strong>well-documented and tested</strong>
            {" "}
            before submitting.
          </Small>
        </P>
      </Section>
      <Section>
        <Large>📥 Step 4: Commit & Push</Large>
        <P>
          <Small>
            After making changes, commit and push them:
          </Small>
        </P>
        <CodeBlock>
          {"git add .\ngit commit -m \"Brief description of changes\"\ngit push origin feature-branch"}
        </CodeBlock>
      </Section>
      <Section>
        <Large>✅ Step 5: Open a Pull Request</Large>
        <P>
          <Small>
            Open a
            {" "}
            <strong>pull request (PR)</strong>
            {" "}
            on GitHub to merge your changes.
          </Small>
        </P>
        <P>
          <Small>
            <TypographyLink href="https://github.com/steelesh/UCollab/pulls" isExternal>
              Open a pull request here
            </TypographyLink>
            .
          </Small>
        </P>
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
        <Small>
          <Muted>
            Have questions? Reach out at
            {" "}
            <TypographyLink href="mailto:support@ucollab.com">support@ucollab.com</TypographyLink>
            .
          </Muted>
        </Small>
      </Section>
    </Container>
  );
}
