// src/app/dashboard/All/userDB-management/components/UserDBSearchBar.tsx

"use client";

import { Stack, TextField, MenuItem, Button } from "@mui/material";

interface Props {
  filterType: string;
  setFilterType: (type: string) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  onSearch: () => void;
}

export default function UserDBSearchBar({
  filterType,
  setFilterType,
  searchKeyword,
  setSearchKeyword,
  onSearch,
}: Props) {
  return (
    <Stack direction="row" spacing={2} mt={3} mb={1} alignItems="center">
      <TextField
        select
        size="small"
        label="필터 기준"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        sx={{ width: 140 }}
      >
        <MenuItem value="phonenumber">휴대폰번호</MenuItem>
        <MenuItem value="username">이름</MenuItem>
        <MenuItem value="manager">담당자</MenuItem>
        <MenuItem value="type">DB 유형</MenuItem>
      </TextField>

      <TextField
        size="small"
        label="검색어 입력"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        sx={{ minWidth: 200 }}
      />

      <Button variant="outlined" onClick={onSearch}>
        검색
      </Button>
    </Stack>
  );
}
