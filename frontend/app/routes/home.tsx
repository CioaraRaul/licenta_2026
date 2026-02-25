import { redirect } from "react-router";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AutoVault" },
    { name: "description", content: "Welcome to AutoVault" },
  ];
}

export function clientLoader() {
  return redirect("/dashboard");
}

export default function Home() {
  return null;
}
