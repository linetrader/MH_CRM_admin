// src/app/dashboard/All/user-management/UserTable.tsx

import { useEffect, useState } from "react";
import { User } from "@/types/User";
import DataTable from "@/components/common/DataTable";
import EditUserModal from "./EditUserModal";
import { useFetchUsers } from "@/hooks/useFetchUsers";

interface Props {
  users: User[];
  onSelectedUsersChange: (selected: User[]) => void;
}

export default function UserTable({ users, onSelectedUsersChange }: Props) {
  const { updateUser } = useFetchUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>(users);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  useEffect(() => {
    setUserList(users);
  }, [users]);

  useEffect(() => {
    onSelectedUsersChange(selectedRows);
  }, [selectedRows, onSelectedUsersChange]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const isUpdated = await updateUser(updatedUser);

      if (isUpdated) {
        setUserList((prev) =>
          prev.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSelectedUser(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? [...userList] : [];
    setSelectedRows(newSelection);
  };

  const handleSelectRow = (checked: boolean, user: User) => {
    setSelectedRows((prev) =>
      checked ? [...prev, user] : prev.filter((u) => u.id !== user.id)
    );
  };

  const columns: Array<{
    key: keyof User | "actions";
    label: string;
    format?: (
      value: User[keyof User] | undefined,
      row?: User
    ) => string | JSX.Element;
    isAction?: boolean;
  }> = [
    { key: "id", label: "ID" },
    { key: "username", label: "이름" },
    { key: "email", label: "이메일" },
    { key: "status", label: "상태" },
    { key: "referrer", label: "책임자", format: (value) => value || "N/A" },
    { key: "userLevel", label: "레벨" },
    {
      key: "createdAt",
      label: "Created At",
      format: (value) =>
        value ? new Date(Number(value)).toLocaleString() : "Invalid Date",
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
        data={userList}
        columns={columns}
        onAction={handleEdit}
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </>
  );
}
