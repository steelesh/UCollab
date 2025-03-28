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
  title: "UCollab — Privacy",
};

export default function Page() {
  return (
    <Container as="article" size="4xl">
      <PageBreadcrumb
        items={[
          { label: "Privacy", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Privacy Policy</H1>
        <Muted>
          <Small>
            Last Updated:
            {" "}
            November 11th, 2024
          </Small>
        </Muted>
        <P className="italic">UCollab ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</P>
      </Header>
      <Section>
        <Large>🔒 Introduction</Large>
        <Muted>
          By using our application or any associated services (collectively, the "Service"), you agree to the collection
          and use of information in accordance with this Privacy Policy.
        </Muted>
        <Large className="mt-8">📊 1. Information Collection</Large>
        <Muted>We only collect information that is necessary for the operation, maintenance, and improvement of our Service.</Muted>
        <List>
          <ListItem>
            <strong>Personal Information:</strong>
            {" "}
            Information provided by you, such as your name, email address, and account details.
          </ListItem>
          <ListItem>
            <strong>Usage Information:</strong>
            {" "}
            Non-identifiable data such as device type, IP address, browser type, and operating system.
          </ListItem>
          <ListItem>
            <strong>Application Data:</strong>
            {" "}
            Preferences, settings, and other customizations that improve user experience.
          </ListItem>
        </List>
        <Large className="mt-8">🎯 2. Use of Information</Large>
        <Muted>We only use your information for purposes directly related to the operation of our Service:</Muted>
        <List>
          <ListItem>Account creation, verification, and management.</ListItem>
          <ListItem>Providing customer support and responding to inquiries.</ListItem>
          <ListItem>Ensuring the security, stability, and functionality of the Service.</ListItem>
          <ListItem>Analyzing usage data to improve the quality and functionality of the Service.</ListItem>
          <ListItem>Conducting internal research and analytics for product development.</ListItem>
        </List>
        <Large className="mt-8">🤝 3. Data Sharing and Disclosure</Large>
        <Muted>Your privacy is a priority. We do not sell, rent, or trade your personal information with any third parties.</Muted>
        <List>
          <ListItem>
            <strong>Service Providers:</strong>
            {" "}
            Third-party services for hosting, analytics, and payments (contractually obligated to protect your data).
          </ListItem>
          <ListItem>
            <strong>Legal Obligations:</strong>
            {" "}
            Disclosures required by law or court orders to protect users or comply with regulations.
          </ListItem>
        </List>
        <Large className="mt-8">⏳ 4. Data Retention</Large>
        <Muted>
          We retain your personal information only as long as necessary for Service functionality and legal compliance.
          Upon request, we will delete or anonymize your data.
        </Muted>
        <Large className="mt-8">🛡️ 5. Security of Your Information</Large>
        <Muted>
          We implement commercially reasonable security measures to protect your data but cannot guarantee absolute
          security.
        </Muted>
        <Large className="mt-8">👤 6. User Rights and Choices</Large>
        <List>
          <ListItem>
            <strong>Access:</strong>
            {" "}
            Request access to your personal information.
          </ListItem>
          <ListItem>
            <strong>Correction:</strong>
            {" "}
            Request updates to inaccurate or incomplete data.
          </ListItem>
          <ListItem>
            <strong>Deletion:</strong>
            {" "}
            Request deletion of personal information no longer needed.
          </ListItem>
          <ListItem>
            <strong>Data Portability:</strong>
            {" "}
            Request an export of your personal information.
          </ListItem>
        </List>
        <Large className="mt-8">📝 7. Changes to This Privacy Policy</Large>
        <Muted>We may update this Privacy Policy periodically. Any updates will be reflected in the "Last Updated" section.</Muted>
        <Large className="mt-8">✨ Conclusion</Large>
        <Muted>
          At UCollab, we prioritize your privacy. We follow strict security and data protection standards to ensure your
          information remains safe while providing the best user experience.
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
