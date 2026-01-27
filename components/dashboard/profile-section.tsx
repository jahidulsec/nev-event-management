import { Section } from "@/components/shared/section/section";
import { AuthUser } from "@/types/auth-user";

export default function ProfileSection({ user }: { user: AuthUser }) {
  return (
    <Section className="flex items-center flex-wrap sm:flex-nowrap gap-5">
      <div className="w-full">
        <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
        <p className="text-sm text-muted-foreground">
          Take a look into recent activities
        </p>
      </div>

      {/* <CreateQuizButton /> */}
    </Section>
  );
}
