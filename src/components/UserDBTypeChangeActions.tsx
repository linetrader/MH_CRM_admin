// src/app/dashboard/All/userDB-management/components/UserDBTypeChangeActions.tsx

"use client";

import { DB_TYPES } from "@/types/dbTypes";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

interface Props {
  newDBType: string;
  onDBTypeChange: (type: string) => void;
  onBatchTypeChange: () => void;
}

export default function UserDBTypeChangeActions({
  newDBType,
  onDBTypeChange,
  onBatchTypeChange,
}: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>DB 유형 변경</InputLabel>
        <Select
          label="DB 유형 변경"
          value={newDBType}
          onChange={(e) => onDBTypeChange(e.target.value)}
        >
          {DB_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" color="success" onClick={onBatchTypeChange}>
        선택 DB 유형 변경
      </Button>
    </Stack>
  );
}
