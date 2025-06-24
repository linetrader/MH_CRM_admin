// src/app/dashboard/All/user-management/CreateUserModal.tsx

import { useState } from "react";
import { User } from "@/types/User";
import EditableFields from "@/components/common/EditableFields";
import { Box, Typography } from "@mui/material";
import { useFetchUsers } from "@/hooks/useFetchUsers"; // ✅ createUser 사용

interface CreateUserModalProps {
  onClose: () => void;
  onCreated?: (newUser: User) => void; // ✅ 상위 컴포넌트에 새 유저 전달
}

export default function CreateUserModal({
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const { createUser } = useFetchUsers();

  const [formData, setFormData] = useState<{
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    passwordConfirm: string;
    referrer: string;
  }>({
    id: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    passwordConfirm: "",
    referrer: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    setError(null);

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setCreating(true);

    const { passwordConfirm, ...newUserInput } = formData;

    const createdUser = await createUser({
      ...newUserInput,
      password: formData.password,
    });

    setCreating(false);

    if (createdUser) {
      if (onCreated) onCreated(createdUser); // 리스트에 추가
      onClose(); // 모달 닫기
    } else {
      setError("유저 생성에 실패했습니다.");
    }
  };

  const fields: Array<{ label: string; name: keyof typeof formData }> = [
    { label: "Email", name: "email" },
    { label: "Username", name: "username" },
    { label: "Password", name: "password" },
    { label: "Confirm Password", name: "passwordConfirm" },
    { label: "Referrer", name: "referrer" },
  ];

  return (
    <>
      {error && (
        <Box p={2} color="red">
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}
      <EditableFields
        data={formData}
        fields={fields}
        onChange={handleChange}
        onClose={onClose}
        onSave={handleCreate}
        loading={creating}
        type="password" // 필드별 input type 처리 가능 시 적용
      />
    </>
  );
}
