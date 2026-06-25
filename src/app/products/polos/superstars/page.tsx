import { redirect } from "next/navigation";

export default function SuperStarsRedirectPage() {
  redirect("/products/polos?collection=SuperStars");
}
