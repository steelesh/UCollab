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
  title: "UCollab — Accessibility",
};

export default function Page() {
  return (
    <Container as="article" size="4xl">
      <PageBreadcrumb
        items={[
          { label: "Accessibility", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Accessibility</H1>
        <Muted>
          <Small>
            Last Updated:
            {" "}
            March 7th, 2025
          </Small>
        </Muted>
        <P className="italic">UCollab is committed to ensuring digital accessibility for all users. We adhere to the Web Content Accessibility Guidelines (WCAG) to create an inclusive experience for all visitors.</P>
      </Header>
      <Section>
        <Large>♿️ Our Accessibility Features</Large>
        <Muted>We've implemented several features to ensure our platform is accessible to everyone:</Muted>
        <List>
          <ListItem>
            <strong>Radix Certified Contrast:</strong>
            {" "}
            Our color palette is designed for maximum readability across different themes.
          </ListItem>
          <ListItem>
            <strong>Mobile Accessibility:</strong>
            {" "}
            The UCollab website is optimized for mobile devices, ensuring smooth access on all screen sizes.
          </ListItem>
          <ListItem>
            <strong>Text-to-Speech:</strong>
            {" "}
            We utilize Web Accessibility Initiative (WAI) standards to enable text-to-speech functionality.
          </ListItem>
        </List>
        <Large className="mt-8">🔄 Commitment to Improvement</Large>
        <Muted>
          We continuously work to improve accessibility by conducting audits and implementing feedback-driven
          enhancements.
        </Muted>
        <Large className="mt-8">📞 Contact Us</Large>
        <Muted>
          If you encounter any accessibility issues or have recommendations, please contact us. We are dedicated to
          making UCollab an inclusive and user-friendly platform for everyone.
        </Muted>
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
