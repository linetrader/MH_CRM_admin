// src/app/dashboard/All/user-management/EditUserModal.tsx

import { useState } from "react";
import { User } from "@/types/User";
import EditableFields from "@/components/common/EditableFields";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export default function EditUserModal({
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const fields: Array<{ label: string; name: keyof User }> = [
    { label: "Username", name: "username" },
    { label: "First Name", name: "firstname" },
    { label: "Last Name", name: "lastname" },
    { label: "Email", name: "email" },
    { label: "Status", name: "status" },
    { label: "Referrer", name: "referrer" },
    { label: "User Level", name: "userLevel" },
  ];

  return (
    <EditableFields
      data={formData}
      fields={fields}
      onChange={handleChange}
      onClose={onClose}
      onSave={handleSave}
    />
  );
}
