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
  onSave?: (memo: string) => void;
  readonly?: boolean;
}

export default function MemoModal({
  user,
  onClose,
  onSave,
  readonly = false,
}: MemoModalProps) {
  const initialValue = readonly
    ? user.sms || "" // ✅ 문자 보기 모드일 때는 sms만 표시
    : user.memo || ""; // ✅ 메모 수정 모드일 때는 memo만 표시

  const [memo, setMemo] = useState(initialValue);

  const handleSave = () => {
    if (onSave) onSave(memo);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {readonly
          ? `문자 내용 보기 - ${user.username}`
          : `상담 기록 수정 - ${user.username}`}
      </DialogTitle>
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
        <Button onClick={onClose}>닫기</Button>
        {!readonly && onSave && (
          <Button variant="contained" onClick={handleSave}>
            저장
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
