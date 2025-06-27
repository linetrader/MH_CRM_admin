// src/app/dashboard/userDBTable/UserDBTable.tsx

"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";
import EditUserDBModal from "./EditUserDBModal";

interface Props {
  users: UserDB[];
  dbType: string; // ✅ 추가
  onSelectedUsersChange: (selected: UserDB[]) => void;
}

export default function UserDBTable({
  users,
  dbType,
  onSelectedUsersChange,
}: Props) {
  const { updateUserDB } = useFetchUsersDB();

  const [selectedRows, setSelectedRows] = useState<UserDB[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDB | null>(null);

  useEffect(() => {
    onSelectedUsersChange(selectedRows);
  }, [selectedRows, onSelectedUsersChange]);

  const handleEdit = (user: UserDB) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSaveUser = async (updatedUser: UserDB) => {
    try {
      const isUpdated = await updateUserDB(updatedUser.id, updatedUser);
      if (isUpdated) {
        alert("업데이트 완료");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSelectedUser(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? [...users] : []);
  };

  const handleSelectRow = (checked: boolean, user: UserDB) => {
    setSelectedRows((prev) =>
      checked ? [...prev, user] : prev.filter((u) => u.id !== user.id)
    );
  };

  const columns: Array<{
    key: keyof UserDB | "actions";
    label: string;
    format?: (
      value: UserDB[keyof UserDB] | undefined,
      row?: UserDB
    ) => string | JSX.Element;
    isAction?: boolean;
  }> = [
    { key: "username", label: "이름" },
    { key: "phonenumber", label: "휴대폰 번호" },
    { key: "sex", label: "성별" },
    { key: "incomepath", label: "유입 경로" },
    { key: "creatorname", label: "크리에이터" },
    { key: "memo", label: "상담 기록" },
    { key: "manager", label: "담당자" },
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
    },
  ];

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        onAction={handleEdit}
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />

      {selectedUser && (
        <EditUserDBModal
          user={selectedUser}
          //dbType={dbType} // ✅ 전달
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </>
  );
}
