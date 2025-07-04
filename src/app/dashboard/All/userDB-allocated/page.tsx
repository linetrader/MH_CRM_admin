"use client";

import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";
import UserDBTable from "../../userDBTable/UserDBTable";
import Pagination from "@/components/common/Pagination";
import UserDBTypeChangeActions from "@/components/UserDBTypeChangeActions";
import UserDBSearchBar from "@/components/UserDB-SearchBar/UserDBSearchBar";
import AssignManagerActions from "@/components/AssignManagerActions";

export default function UserDBAllocatedPage() {
  const {
    users,
    totalUsers,
    loading,
    error,
    fetchUserDBsUnderMyNetwork,
    updateUserDB,
    fetchUsernamesUnderMyNetwork,
    searchUserDBsWithOr,
  } = useFetchUsersDB();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<UserDB[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("phonenumber");
  const [filteredUsers, setFilteredUsers] = useState<UserDB[]>([]);
  const [newDBType, setNewDBType] = useState("");
  const [managerList, setManagerList] = useState<string[]>([]);

  const limit = 100;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    fetchUserDBsUnderMyNetwork(limit, offset, false);
  }, [currentPage]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    let ignore = false;
    const loadManagers = async () => {
      const result = await fetchUsernamesUnderMyNetwork();
      if (!ignore) {
        setManagerList(result);
      }
    };
    loadManagers();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = () => {
    const filters: any = {
      [filterType]: searchKeyword.trim(),
    };

    searchUserDBsWithOr(limit, offset, filters);
    setCurrentPage(1);
  };

  const handleBatchTypeChange = async () => {
    if (selectedUsers.length === 0) {
      alert("변경할 사용자를 선택하세요.");
      return;
    }
    if (!newDBType) {
      alert("변경할 DB 유형을 선택하세요.");
      return;
    }

    const confirmed = window.confirm(
      `선택된 ${selectedUsers.length}명의 DB 유형을 "${newDBType}"로 변경하시겠습니까?`
    );
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedUsers.map((user) =>
          updateUserDB(user.id, { ...user, type: newDBType })
        )
      );
      alert("DB 유형 변경이 완료되었습니다.");
      setSelectedUsers([]);
      fetchUserDBsUnderMyNetwork(limit, offset, false);
    } catch (error) {
      alert("DB 유형 변경 중 오류가 발생했습니다.");
      console.error("DB 유형 변경 실패:", error);
    }
  };

  const handleAssignManager = async (manager: string) => {
    try {
      await Promise.all(
        selectedUsers.map((user) => updateUserDB(user.id, { ...user, manager }))
      );
      alert("담당자 배정이 완료되었습니다.");
      setSelectedUsers([]);
      fetchUserDBsUnderMyNetwork(limit, offset, false);
    } catch (error) {
      alert("담당자 배정 중 오류가 발생했습니다.");
      console.error("담당자 배정 실패:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        배분된 유저 DB
      </Typography>

      <UserDBSearchBar
        filterType={filterType}
        setFilterType={setFilterType}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearch={handleSearch}
      />

      <UserDBTypeChangeActions
        newDBType={newDBType}
        onDBTypeChange={setNewDBType}
        onBatchTypeChange={handleBatchTypeChange}
      />

      <AssignManagerActions
        managers={managerList}
        selectedUsers={selectedUsers}
        onAssignManager={handleAssignManager}
      />

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
            onClick={() => fetchUserDBsUnderMyNetwork(limit, offset, false)}
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
            users={filteredUsers}
            onSelectedUsersChange={setSelectedUsers}
            dbType=""
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
    </Box>
  );
}
