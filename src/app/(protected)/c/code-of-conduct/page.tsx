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
  title: "UCollab — Code of Conduct",
};

export default function Page() {
  return (
    <Container as="article">
      <PageBreadcrumb
        items={[
          { label: "Code of Conduct", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Code of Conduct</H1>
        <P className="italic">UCollab is committed to maintaining a respectful, inclusive, and collaborative environment for all members.</P>
      </Header>
      <Section>
        <Large>📌 Our Core Values</Large>
        <List>
          <ListItem>
            <strong>♦️ Respect:</strong>
            {" "}
            Treat everyone with kindness and professionalism.
          </ListItem>
          <ListItem>
            <strong>♦️ Inclusivity:</strong>
            {" "}
            Embrace diversity and create an open, welcoming space.
          </ListItem>
          <ListItem>
            <strong>♦️ Collaboration:</strong>
            {" "}
            Work together constructively, valuing all contributions.
          </ListItem>
          <ListItem>
            <strong>♦️ Integrity:</strong>
            {" "}
            Be honest, ethical, and take responsibility for your actions.
          </ListItem>
        </List>
      </Section>
      <Section>
        <Large>🚫 Unacceptable Behavior</Large>
        <Muted>The following behaviors are not tolerated within UCollab:</Muted>
        <List>
          <ListItem>Harassment, discrimination, or targeted attacks.</ListItem>
          <ListItem>Hate speech, offensive language, or disrespectful conduct.</ListItem>
          <ListItem>Disruptive behavior or intentional misinformation.</ListItem>
          <ListItem>Sharing private or sensitive data without consent.</ListItem>
        </List>
      </Section>
      <Section>
        <Large>⚖️ Consequences & Enforcement</Large>
        <Muted>Violations of this Code of Conduct may result in the following actions:</Muted>
        <List>
          <ListItem>Warning from moderators or administrators.</ListItem>
          <ListItem>Temporary or permanent suspension from UCollab.</ListItem>
          <ListItem>Escalation to university authorities or legal action (if applicable).</ListItem>
        </List>
      </Section>
      <Section>
        <Large>📬 Reporting Violations</Large>
        <Muted>
          If you witness or experience behavior that violates this Code of Conduct, please report it confidentially to
          {" "}
          <TypographyLink href="mailto:support@ucollab.com">support@ucollab.com</TypographyLink>
          .
        </Muted>
      </Section>
      <Section className="text-center mt-20">
        <Small>
          <Muted>
            This Code of Conduct is adapted from the Contributor Covenant v2.1. Read more at
            {" "}
            <TypographyLink href="https://www.contributor-covenant.org/version/2/1/code_of_conduct/" isExternal>
              contributor-covenant.org
            </TypographyLink>
            .
          </Muted>
        </Small>
      </Section>
    </Container>
  );
}
