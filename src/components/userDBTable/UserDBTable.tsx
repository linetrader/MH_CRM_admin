// src/components/userDBTable/UserDBTable.tsx

"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";
import EditUserDBModal from "./EditUserDBModal";
import MemoModal from "@/components/common/MemoModal";
import { useLogin } from "@/hooks/useLogin";

interface Props {
  users: UserDB[];
  onSelectedUsersChange: (selected: UserDB[]) => void;
  onMemoUpdated?: () => void; // ✅ 콜백 props
}

export default function UserDBTable({
  users,
  onSelectedUsersChange,
  onMemoUpdated, // ✅ 받아오기
}: Props) {
  const { updateUserDB } = useFetchUsersDB();
  const { userLevel } = useLogin();

  const [selectedRows, setSelectedRows] = useState<UserDB[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDB | null>(null);
  const [smsUser, setSmsUser] = useState<UserDB | null>(null);
  const [memoUser, setMemoUser] = useState<UserDB | null>(null);

  useEffect(() => {
    onSelectedUsersChange(selectedRows);
  }, [selectedRows, onSelectedUsersChange]);

  const handleEdit = (user: UserDB) => setSelectedUser(user);
  const handleCloseModal = () => setSelectedUser(null);

  const handleSaveUser = async (updatedUser: UserDB) => {
    try {
      const isUpdated = await updateUserDB(updatedUser.id, updatedUser);
      if (isUpdated) alert("업데이트 완료");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSelectedUser(null);
    }
  };

  const handleSmsClick = (user: UserDB) => setSmsUser(user);
  const handleCloseSmsModal = () => setSmsUser(null);

  const handleMemoClick = (user: UserDB) => setMemoUser(user);
  const handleCloseMemoModal = () => setMemoUser(null);

  const handleSaveMemo = async (updatedMemo: string) => {
    if (!memoUser) return;
    try {
      const updatedUser = { ...memoUser, memo: updatedMemo };
      const isUpdated = await updateUserDB(updatedUser.id, updatedUser);
      if (isUpdated) {
        alert("메모 업데이트 완료");
        if (onMemoUpdated) onMemoUpdated(); // ✅ 외부 콜백 실행
      }
    } catch (error) {
      console.error("Error updating memo:", error);
    } finally {
      setMemoUser(null);
    }
  };

  const handleSelectAll = (checked: boolean) =>
    setSelectedRows(checked ? [...users] : []);

  const handleSelectRow = (checked: boolean, user: UserDB) =>
    setSelectedRows((prev) =>
      checked ? [...prev, user] : prev.filter((u) => u.id !== user.id)
    );

  const allColumns: Array<{
    key: keyof UserDB | "actions";
    label: string;
    format?: (
      value: UserDB[keyof UserDB] | undefined,
      row?: UserDB
    ) => string | JSX.Element;
    isAction?: boolean;
    userLevel?: number;
  }> = [
    { key: "username", label: "이름" },
    { key: "phonenumber", label: "휴대폰 번호" },
    {
      key: "sms",
      label: "문자",
      format: (value, row) =>
        value && typeof value === "string" ? (
          <span
            style={{ cursor: "pointer", color: "#1976d2" }}
            onClick={() => handleSmsClick(row!)}
            title="클릭하여 전체 내용 보기"
          >
            {value.length > 5 ? `${value.slice(0, 5)}...` : value}
          </span>
        ) : (
          ""
        ),
    },
    { key: "incomepath", label: "유입 경로" },
    { key: "creatorname", label: "크리에이터" },
    {
      key: "memo",
      label: "상담 기록",
      format: (value, row) =>
        value && typeof value === "string" ? (
          <span
            style={{ cursor: "pointer", color: "#1976d2" }}
            onClick={() => handleMemoClick(row!)}
            title="클릭하여 전체 내용 보기"
          >
            {value.length > 20 ? `${value.slice(0, 20)}...` : value}
          </span>
        ) : (
          ""
        ),
    },
    {
      key: "type",
      label: "DB 유형",
      format: (value) => {
        const typeMap: Record<string, string> = {
          els: "기타 DB",
          stock_new: "신규 DB(주식)",
          stock_old: "구 DB(주식)",
          coin_new: "신규 DB(코인)",
          coin_old: "구 DB(코인)",
          potential: "가망 DB",
          customer_fund1: "펀드1 (도지 채굴기)",
          customer_fund2: "펀드2 (데이터 센터)",
          customer_fund3: "펀드3 (VAST)",
          black_longterm: "부재",
          black_notIdentity: "단선",
          black_wrongnumber: "결번",
        };
        return typeMap[String(value)] ?? String(value);
      },
    },
    { key: "manager", label: "담당자" },
    { key: "incomedate", label: "유입 날짜" },
    {
      key: "createdAt",
      label: "DB 생성 시간",
      format: (value) =>
        value ? new Date(value).toLocaleString() : "Invalid Date",
    },
    {
      key: "updatedAt",
      label: "마지막 상담 시간",
      format: (value) =>
        value ? new Date(value).toLocaleString() : "Invalid Date",
    },
    {
      key: "actions",
      label: "Actions",
      isAction: true,
      userLevel: 1,
    },
  ];

  const getVisibleColumns = () =>
    allColumns.filter(
      (col) =>
        !col.userLevel || (userLevel !== null && userLevel <= col.userLevel)
    );

  return (
    <>
      <DataTable
        data={users}
        columns={getVisibleColumns()}
        onAction={
          userLevel !== null && userLevel === 1 ? handleEdit : undefined
        }
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />

      {smsUser && (
        <MemoModal
          user={smsUser}
          onClose={handleCloseSmsModal}
          readonly={true}
        />
      )}

      {memoUser && (
        <MemoModal
          user={memoUser}
          onClose={handleCloseMemoModal}
          onSave={handleSaveMemo}
        />
      )}

      {selectedUser && (
        <EditUserDBModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </>
  );
}
