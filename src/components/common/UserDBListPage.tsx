// src/components/common/UserDBListPage.tsx

"use client";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";
import Pagination from "@/components/common/Pagination";
import UserDBTable from "@/app/dashboard/userDBTable/UserDBTable";
import UserDBSearchBar from "../UserDB-SearchBar/UserDBSearchBar";

interface Props {
  title: string;
  dbType: string;
}

export default function UserDBListPage({ title, dbType }: Props) {
  const {
    users,
    totalUsers,
    loading,
    error,
    fetchUserDBsUnderMyNetwork,
    searchUserDBsWithOr,
  } = useFetchUsersDB();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("phonenumber");
  //const [filteredUsers, setFilteredUsers] = useState<UserDB[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const limit = 30;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    if (isSearching) {
      const filters: any = {
        [filterType]: searchKeyword.trim(),
      };
      searchUserDBsWithOr(limit, offset, filters);
    } else {
      fetchUserDBsUnderMyNetwork(limit, offset, true, dbType);
    }
  }, [currentPage, dbType, isSearching]);

  const handleSearch = () => {
    const filters: any = {
      [filterType]: searchKeyword.trim(),
    };

    setIsSearching(true); // ✅ 검색 상태로 전환
    setCurrentPage(1); // ✅ 검색은 항상 1페이지부터 시작
    searchUserDBsWithOr(limit, 0, filters); // offset = 0
  };

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      <Button
        variant="outlined"
        onClick={() => {
          setIsSearching(false);
          setSearchKeyword("");
          setCurrentPage(1); // 첫 페이지부터 다시 전체 조회
        }}
      >
        전체 보기
      </Button>

      <UserDBSearchBar
        filterType={filterType}
        setFilterType={setFilterType}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearch={handleSearch}
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
          <Typography mt={2} align="center" fontWeight="bold">
            다시 시도해 주세요.
          </Typography>
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
            onSelectedUsersChange={() => {}}
            dbType={dbType}
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
