// src/components/AssignManagerActions.tsx

"use client";

import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";

interface Props {
  managers: string[];
  selectedUsers: UserDB[];
  onAssignManager: (manager: string) => void;
}

export default function AssignManagerActions({
  managers,
  selectedUsers,
  onAssignManager,
}: Props) {
  const [selectedManager, setSelectedManager] = useState("");

  const handleAssign = () => {
    if (!selectedManager) {
      alert("담당자를 선택하세요.");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("배정할 사용자를 선택하세요.");
      return;
    }

    const confirmed = window.confirm(
      `선택한 ${selectedUsers.length}명에게 "${selectedManager}"를 담당자로 배정하시겠습니까?`
    );
    if (confirmed) {
      onAssignManager(selectedManager);
    }
  };

  return (
    <Stack direction="row" spacing={2} my={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>담당자 선택</InputLabel>
        <Select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
          label="담당자 선택"
        >
          {managers.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAssign}
        disabled={selectedUsers.length === 0}
      >
        담당자 배정
      </Button>
    </Stack>
  );
}
