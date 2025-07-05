"use client";

import UserDBListPage from "@/components/userDBTable/UserDBListPage";

export default function UserDBAllocatedPage() {
  return (
    <UserDBListPage
      title="배분 DB 관리"
      dbType="allocated" // 필요 시 사용되는 DB 유형
      pageType="allocated" // 페이지 타입을 명시적으로 전달
    />
  );
}
