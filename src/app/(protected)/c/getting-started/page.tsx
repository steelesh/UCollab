import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Large } from "~/components/ui/large";
import { TypographyLink } from "~/components/ui/link";
import { Muted } from "~/components/ui/muted";
import { P } from "~/components/ui/p";
import { Section } from "~/components/ui/section";
import { Small } from "~/components/ui/small";

export const metadata = {
  title: "UCollab — Getting Started",
};

export default function Page() {
  return (
    <Container as="article" size="4xl">
      <PageBreadcrumb
        items={[
          { label: "Getting Started", isCurrent: true },
        ]}
      />
      <Header>
        <H1>🚀 Getting Started with UCollab</H1>
        <P className="italic">Follow this guide to quickly set up your account, explore projects, and start collaborating.</P>
      </Header>
      <Section>
        <Large>📌 Step 1: Create Your Account</Large>
        <Muted>To start using UCollab, sign up or log in using your university email or GitHub account.</Muted>
      </Section>
      <Section>
        <Large>🔍 Step 2: Explore Projects</Large>
        <Muted>
          Browse open-source projects, find a team, or start your own project. Visit the
          {" "}
          <TypographyLink href="/p">Projects Page</TypographyLink>
          {" "}
          to see what's available.
        </Muted>
      </Section>
      <Section>
        <Large>🤝 Step 3: Join the Community</Large>
        <Muted>
          Engage with other developers through discussions, contribute to repositories, and share ideas.
        </Muted>
        <Muted>
          Read our
          {" "}
          <TypographyLink href="/c/community-guide">Community Guide</TypographyLink>
          {" "}
          for best practices.
        </Muted>
      </Section>
      <Section>
        <Large>✅ Step 4: Contribute</Large>
        <Muted>
          Ready to contribute? Check out our
          {" "}
          <TypographyLink href="/c/contribution-guide">Contribution Guide</TypographyLink>
          {" "}
          for guidelines on submitting code, reporting issues, and reviewing pull requests.
        </Muted>
      </Section>
      <Section className="text-center mt-20">
        <Small>
          <Muted>
            Need help? Reach out to
            {" "}
            <TypographyLink href="mailto:support@ucollab.com">support@ucollab.com</TypographyLink>
            .
          </Muted>
        </Small>
      </Section>
    </Container>
  );
}
