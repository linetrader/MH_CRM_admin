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
  selectedUsers: UserDB[];
  onAssignDBType: (dbType: string) => void;
}

const DB_TYPES = [
  { value: "els", label: "기타 DB" },
  { value: "stock_new", label: "신규 DB(주식)" },
  { value: "stock_old", label: "구 DB(주식)" },
  { value: "coin_new", label: "신규 DB(코인)" },
  { value: "coin_old", label: "구 DB(코인)" },
  { value: "potential", label: "가망 DB" },
  { value: "customer_fund1", label: "펀드 1(도지 채굴기)" },
  { value: "customer_fund2", label: "펀드 2(데이터 센터)" },
  { value: "customer_fund3", label: "펀드 3(VAST 코인)" },
  { value: "black_longterm", label: "부재" },
  { value: "black_notIdentity", label: "단선" },
  { value: "black_wrongnumber", label: "결번" },
];

export default function AssignDBTypeActions({
  selectedUsers,
  onAssignDBType,
}: Props) {
  const [selectedDBType, setSelectedDBType] = useState("");

  const handleAssign = () => {
    if (!selectedDBType) {
      alert("DB 유형을 선택하세요.");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("이동할 사용자를 선택하세요.");
      return;
    }

    const confirmed = window.confirm(
      `선택한 ${selectedUsers.length}명을 "${
        DB_TYPES.find((item) => item.value === selectedDBType)?.label
      }" 유형으로 이동하시겠습니까?`
    );

    if (confirmed) {
      onAssignDBType(selectedDBType);
    }
  };

  return (
    <Stack direction="row" spacing={2} my={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>DB 유형 선택</InputLabel>
        <Select
          value={selectedDBType}
          onChange={(e) => setSelectedDBType(e.target.value)}
          label="DB 유형 선택"
        >
          {DB_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleAssign}
        disabled={selectedUsers.length === 0}
      >
        DB 유형 이동
      </Button>
    </Stack>
  );
}
