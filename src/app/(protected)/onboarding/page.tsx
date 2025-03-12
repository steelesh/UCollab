import { OnboardingForm } from '~/components/onboarding/onboarding-form';
import { withOnboarding } from '~/security/protected';

export const metadata = {
  title: 'UCollab — Onboarding',
};

async function OnboardingPage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto pt-8">
      <div className="bg-base-300 mx-auto w-full max-w-5xl rounded-lg p-4 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Onboarding</h2>
        <OnboardingForm />
      </div>
    </div>
  );
}

export default withOnboarding(OnboardingPage);
