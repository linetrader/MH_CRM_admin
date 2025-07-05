"use client";

import UserDBListPage from "@/components/userDBTable/UserDBListPage";

export default function StockNewPage() {
  return (
    <UserDBListPage title="본인 인증 안됨 DB 관리" dbType="black_notIdentity" />
  );
}
