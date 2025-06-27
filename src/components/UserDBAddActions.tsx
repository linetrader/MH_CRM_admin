// src/app/dashboard/All/userDB-management/components/UserDBAddActions.tsx

"use client";

import { Button, Stack } from "@mui/material";

interface Props {
  onOpenCreateModal: () => void;
  onExcelUploadClick: () => void;
  onDeleteSelected: () => void;
}

export default function UserDBAddActions({
  onOpenCreateModal,
  onExcelUploadClick,
  onDeleteSelected,
}: Props) {
  return (
    <Stack direction="row" spacing={2} mb={2} alignItems="center">
      <Button variant="contained" color="primary" onClick={onOpenCreateModal}>
        DB 수동 추가
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={onExcelUploadClick}
      >
        DB 엑셀 추가
      </Button>

      <Button variant="contained" color="error" onClick={onDeleteSelected}>
        선택 삭제
      </Button>
    </Stack>
  );
}
