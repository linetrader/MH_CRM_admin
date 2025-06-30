// src/app/dashboard/All/userDB-management/CreateUserDBModal.tsx

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import EditableFields from "@/components/common/EditableFields";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";

interface CreateUserDBModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateUserDBModal({
  onClose,
  onCreated,
}: CreateUserDBModalProps) {
  const { createUserDB } = useFetchUsersDB();

  const [formData, setFormData] = useState<Partial<UserDB> & { id: string }>({
    id: "",
    username: "",
    phonenumber: "",
    sex: "",
    incomepath: "",
    creatorname: "",
    memo: "",
    type: "",
    manager: "",
    incomedate: "", // ✅ 새 필드 추가
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
    setCreating(true);

    const { id, ...inputWithoutId } = formData;

    const created = await createUserDB(inputWithoutId);

    setCreating(false);

    if (created) {
      if (onCreated) onCreated();
      onClose();
    } else {
      setError("유저 생성에 실패했습니다.");
    }
  };

  const fields: Array<{ label: string; name: keyof typeof formData }> = [
    { label: "이름", name: "username" },
    { label: "폰 번호", name: "phonenumber" },
    { label: "성별", name: "sex" },
    { label: "유입 경로", name: "incomepath" },
    { label: "크리에이터", name: "creatorname" },
    { label: "상담 기록", name: "memo" },
    { label: "DB 타입", name: "type" },
    { label: "담당자", name: "manager" },
    { label: "유입 일자", name: "incomedate" }, // ✅ 필드 정의 추가
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
      />
    </>
  );
}
