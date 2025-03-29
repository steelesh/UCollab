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
  title: "UCollab — Community Guide",
};

export default function Page() {
  return (
    <Container as="article" size="4xl">
      <PageBreadcrumb
        items={[
          { label: "Community Guide", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Community Guide</H1>
        <P className="italic">Our goal is to foster a collaborative, innovative, and supportive community for students, developers, and IT professionals.</P>
      </Header>
      <Section>
        <Large>📌 How to Get the Most Out of UCollab</Large>
        <List>
          <ListItem>
            <strong>♦️ Explore Projects:</strong>
            {" "}
            Discover exciting open-source projects and contribute your skills.
          </ListItem>
          <ListItem>
            <strong>♦️ Collaborate:</strong>
            {" "}
            Connect with fellow students and developers to work on meaningful software solutions.
          </ListItem>
          <ListItem>
            <strong>♦️ Share Knowledge:</strong>
            {" "}
            Help others by answering questions and providing insights.
          </ListItem>
          <ListItem>
            <strong>♦️ Follow Best Practices:</strong>
            {" "}
            Ensure code quality, maintainability, and adherence to community standards.
          </ListItem>
        </List>
      </Section>
      <Section>
        <Large>✅ Community Etiquette</Large>
        <Muted>To ensure a positive experience, please follow these guidelines:</Muted>
        <List>
          <ListItem>Be respectful and inclusive in discussions.</ListItem>
          <ListItem>Provide constructive feedback and encourage learning.</ListItem>
          <ListItem>Avoid spam, self-promotion, and irrelevant discussions.</ListItem>
          <ListItem>Report issues and suggest improvements transparently.</ListItem>
        </List>
      </Section>
      <Section>
        <Large>📖 Learning Resources</Large>
        <Muted>Need help getting started? Check out these resources:</Muted>
        <List>
          <ListItem>
            <TypographyLink href="/c/getting-started">Getting Started Guide</TypographyLink>
          </ListItem>
          <ListItem>
            <TypographyLink href="/c/contribution-guide">Contribution Guidelines</TypographyLink>
          </ListItem>
          <ListItem>
            <TypographyLink href="/c/code-of-conduct">Code of Conduct</TypographyLink>
          </ListItem>
        </List>
      </Section>
      <Section className="text-center mt-20">
        <Small>
          <Muted>
            Questions? Reach out to us at
            {" "}
            <TypographyLink href="mailto:support@ucollab.com">support@ucollab.com</TypographyLink>
            .
          </Muted>
        </Small>
      </Section>
    </Container>
  );
}
