// app/(home)/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // 루트에서 로그인 페이지로 리다이렉트
  redirect("/login");
}
