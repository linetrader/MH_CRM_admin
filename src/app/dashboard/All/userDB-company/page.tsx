"use client";

import UserDBListPage from "@/components/userDBTable/UserDBListPage";

export default function UserDBCompanyPage() {
  return (
    <UserDBListPage
      title="전체 회사 DB 관리"
      dbType="" // 필요 시 사용되는 DB 유형
      pageType="company" // 페이지 타입을 명시적으로 전달
    />
  );
}
