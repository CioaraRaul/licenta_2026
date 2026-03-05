import { redirect } from "react-router";

export function clientLoader() {
  return redirect("/dashboard");
}

export default function Index() {
  return null;
}
