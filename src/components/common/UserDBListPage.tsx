// src/components/common/UserDBListPage.tsx

"use client";

import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";
import Pagination from "@/components/common/Pagination";
import UserDBTable from "@/app/dashboard/userDBTable/UserDBTable";

interface Props {
  title: string;
  dbType: string;
}

export default function UserDBListPage({ title, dbType }: Props) {
  const { users, totalUsers, loading, error, fetchUserDBsUnderMyNetwork } =
    useFetchUsersDB();

  const [currentPage, setCurrentPage] = useState(1);

  const limit = 30;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    fetchUserDBsUnderMyNetwork(limit, offset, dbType);
  }, [currentPage, dbType]);

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

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
