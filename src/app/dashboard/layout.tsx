"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box flexGrow={1} p={3} bgcolor="#f5f5f5">
        {children} {/* 하위 경로에 따라 콘텐츠 렌더링 */}
      </Box>
    </Box>
  );
}
