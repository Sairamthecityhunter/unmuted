import { redirect } from "next/navigation";

/**
 * Legacy URL — canonical guidelines live at /guidelines.
 */
export default function RulesPage() {
  redirect("/guidelines");
}
