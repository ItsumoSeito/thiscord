import Onboarding from '@/components/pages/Onboarding.page';
import { isOnboardingComplete } from '@/lib/utils/awsServer/user';

export default async function Home() {
  const onboardingComplete = await isOnboardingComplete();

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello
    </main>
  );
}
