import { OnboardingForm } from "~/components/onboarding/onboarding-form";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { withOnboarding } from "~/security/protected";

export const metadata = {
  title: "UCollab — Onboarding",
};

export const dynamic = "force-dynamic";

async function Page() {
  return (
    <Container className="max-w-5xl">
      <Card variant="glossy" className="p-4 sm:p-8">
        <OnboardingForm />
      </Card>
    </Container>
  );
}

export default withOnboarding(Page);
