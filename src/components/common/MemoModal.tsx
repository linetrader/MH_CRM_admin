// components/MemoModal.tsx
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface MemoModalProps {
  user: UserDB;
  onClose: () => void;
  onSave: (memo: string) => void;
}

export default function MemoModal({ user, onClose, onSave }: MemoModalProps) {
  const [memo, setMemo] = useState(user.memo || "");

  const handleSave = () => {
    onSave(memo);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>상담 기록 수정 - {user.username}</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          fullWidth
          minRows={6}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
