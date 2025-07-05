"use client";

import UserDBListPage from "@/components/userDBTable/UserDBListPage";

export default function UserDBUnAllocatedPage() {
  return (
    <UserDBListPage
      title="미배분 DB 관리"
      dbType="unallocated" // 필요 시 사용되는 DB 유형
    />
  );
}
