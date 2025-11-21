import { ReactNode } from "react";
import "@/animation/slide-right.css";
import { AdminLayout } from "./AdminLayout";

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
