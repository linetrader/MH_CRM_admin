// src/app/dashboard/All/user-management/page.tsx

"use client";

import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import UserTable from "./UserTable";
import Pagination from "../../../../components/common/Pagination";
import CreateUserModal from "./CreateUserModal";
import { User } from "@/types/User";

export default function UserManagementPage() {
  const { users, totalUsers, loading, error, fetchUsers, deleteUser } =
    useFetchUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("username");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const limit = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalUsers / limit);

  const handleSearch = () => {
    fetchUsers(currentPage); // 🔍 필터링 포함 로직 필요 시 추가 구현
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      alert("삭제할 사용자를 선택하세요.");
      return;
    }

    const confirmed = window.confirm("정말 선택된 사용자를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await Promise.all(selectedUsers.map((user) => deleteUser(user.id)));
      alert("삭제가 완료되었습니다.");
      setSelectedUsers([]);
      fetchUsers(currentPage);
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        color: "#333",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        영업팀 관리
      </Typography>
      <Typography>
        영업팀 관리 페이지에서 사용자를 관리할 수 있습니다.
      </Typography>

      <Stack direction="row" spacing={2} mt={3} mb={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>상태 필터</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="상태 필터"
          >
            <MenuItem value="username">이름</MenuItem>
            <MenuItem value="email">이메일</MenuItem>
            <MenuItem value="referrer">책임자</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="영업자 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          size="small"
        />

        <Button variant="outlined" onClick={handleSearch}>
          검색
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCreateModal(true)}
        >
          영업자 추가
        </Button>
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
          sx={{
            backgroundColor: "#ffe6e6",
            color: "#d32f2f",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {error}
          <Button
            onClick={() => fetchUsers(currentPage)}
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
          사용자가 없습니다.
        </Typography>
      )}
      {!loading && !error && users.length > 0 && (
        <Paper
          elevation={2}
          sx={{ mt: 3, backgroundColor: "#ffffff", color: "#333", p: 2 }}
        >
          <UserTable users={users} onSelectedUsersChange={setSelectedUsers} />
        </Paper>
      )}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            fetchUsers(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchUsers(currentPage)}
        />
      )}
    </Box>
  );
}
