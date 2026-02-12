import VerifyEmailComponent from "~/components/auth/verifyEmail";
import type { Route } from "./+types/login";
import { useLoaderData } from "react-router";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  return { code };
}

function VerifyEmail() {
  const { code } = useLoaderData<typeof clientLoader>();

  return <VerifyEmailComponent code={code} />;
}

export default VerifyEmail;
