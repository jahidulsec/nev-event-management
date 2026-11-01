import { getAuthUser } from "@/lib/dal";
import { redirect } from "next/navigation";

// reads the session cookie to decide where to redirect
export const instant = false;

export default async function Home() {
  const authUser = await getAuthUser();

  if (!authUser) redirect("/login");

  return redirect("/dashboard");
}
