// src/components/userDBTable/EditUserDBModal.tsx

import { useState } from "react";
import EditableFields from "@/components/common/EditableFields";

interface EditUserDBModalProps {
  user: UserDB;
  onClose: () => void;
  onSave: (updatedUser: UserDB) => void;
}

export default function EditUserDBModal({
  user,
  onClose,
  onSave,
}: EditUserDBModalProps) {
  const [formData, setFormData] = useState<UserDB>(user);

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

  const fields: Array<{ label: string; name: keyof UserDB }> = [
    { label: "Username", name: "username" },
    { label: "Phone Number", name: "phonenumber" },
    { label: "Sex", name: "sex" },
    { label: "Income Path", name: "incomepath" },
    { label: "Memo", name: "memo" },
    { label: "Type", name: "type" },
    { label: "Manager", name: "manager" },
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
