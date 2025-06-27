// src/app/dashboard/All/userDB-management/page.tsx

"use client";

import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";
import UserDBTable from "../../userDBTable/UserDBTable";
import Pagination from "@/components/common/Pagination";
import CreateUserDBModal from "./CreateUserDBModal";
import * as XLSX from "xlsx";

export default function UserDBManagementPage() {
  const {
    users,
    totalUsers,
    loading,
    error,
    fetchUsersDB,
    deleteUserDB,
    createUserDB,
  } = useFetchUsersDB();

  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserDB[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("phonenumber");
  const [filteredUsers, setFilteredUsers] = useState<UserDB[]>([]);

  const limit = 30;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    fetchUsersDB(limit, offset);
  }, [currentPage]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      setFilteredUsers(users);
      return;
    }

    const result = users.filter((user) => {
      const value = user[filterType as keyof UserDB];
      return value?.toString().toLowerCase().includes(keyword);
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      alert("삭제할 사용자를 선택하세요.");
      return;
    }

    const confirmed = window.confirm("정말 선택된 사용자를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await Promise.all(selectedUsers.map((user) => deleteUserDB(user.id)));
      alert("삭제가 완료되었습니다.");
      setSelectedUsers([]);
      fetchUsersDB(limit, offset);
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();

      reader.onload = async (evt) => {
        const arrayBuffer = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData: any[] = XLSX.utils.sheet_to_json(ws);

        const confirmed = window.confirm(
          `총 ${jsonData.length}개의 항목이 있습니다. 업로드 하시겠습니까?`
        );
        if (!confirmed) return;

        const failed: any[] = [];

        for (const row of jsonData) {
          const result = await createUserDB({
            username: row.username || "",
            phonenumber: row.phonenumber?.toString() || "",
            sex: row.sex || "",
            incomepath: row.incomepath || "",
            creatorname: row.creatorname || "",
            memo: row.memo || "",
            type: row.type || "potential",
            manager: row.manager || "",
          });

          if (!result) failed.push(row);
        }

        if (failed.length > 0) {
          alert(`중복 데이터가 존재해서 일부만 업로드되었습니다.`);
        } else {
          alert("엑셀 업로드가 완료되었습니다.");
        }

        fetchUsersDB(limit, offset);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("엑셀 업로드 오류:", error);
      alert("엑셀 파일 처리 중 오류가 발생했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        유저 DB 관리
      </Typography>

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

        <Button variant="outlined" onClick={handleSearch}>
          검색
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCreateModal(true)}
        >
          DB 수동 추가
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => document.getElementById("excel-upload")?.click()}
        >
          DB 엑셀 추가
        </Button>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          onChange={handleExcelUpload}
        />

        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
        >
          선택 삭제
        </Button>
      </Stack>

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <Box
          mt={3}
          p={2}
          sx={{ backgroundColor: "#ffe6e6", color: "#d32f2f", borderRadius: 1 }}
        >
          {error}
          <Button
            onClick={() => fetchUsersDB(limit, offset)}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            재시도
          </Button>
        </Box>
      )}

      {!loading && !error && users.length === 0 && (
        <Typography mt={3} textAlign="center">
          검색 결과가 없습니다.
        </Typography>
      )}

      {!loading && !error && users.length > 0 && (
        <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
          <UserDBTable
            users={users}
            onSelectedUsersChange={setSelectedUsers}
            dbType={""}
          />
        </Paper>
      )}

      {!loading && !error && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {showCreateModal && (
        <CreateUserDBModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchUsersDB(limit, offset)}
        />
      )}
    </Box>
  );
}
