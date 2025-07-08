// src/components/userDBTable/UserDBListPage.tsx

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
import UserDBTable from "@/components/userDBTable/UserDBTable";
import UserDBSearchBar from "./components/UserDBSearchBar";
import UserDBAddActions from "./components/UserDBAddActions";
import CreateUserDBModal from "./CreateUserDBModal";
import AssignManagerActions from "./components/AssignManagerActions";

interface Props {
  title: string;
  dbType: string;
  pageType?: string; // 페이지 타입은 선택적
}

export default function UserDBListPage({ title, dbType, pageType }: Props) {
  const {
    users,
    totalUsers,
    loading,
    error,
    fetchUserDBsForMainUser,
    fetchUserDBsByMyUsername,
    fetchUserDBsUnderMyNetwork,
    fetchUsernamesUnderMyNetwork,
    searchUserDBsWithOr,
    updateUserDB,
    deleteUserDB,
  } = useFetchUsersDB();

  const [selectedUsers, setSelectedUsers] = useState<UserDB[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("phonenumber");
  //const [filteredUsers, setFilteredUsers] = useState<UserDB[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [managerList, setManagerList] = useState<string[]>([]); // 👈 담당자 리스트

  const limit = 100;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    if (isSearching) {
      const filters: any = {
        [filterType]: searchKeyword.trim(),
      };
      searchUserDBsWithOr(limit, offset, filters);
    } else {
      if (pageType === "company") {
        fetchUserDBsForMainUser(limit, offset);
      } else if (pageType === "unallocated") {
        fetchUserDBsByMyUsername(limit, offset, true);
      } else if (pageType === "allocated") {
        fetchUserDBsUnderMyNetwork(limit, offset, false);
      } else {
        //console.log("알 수 없는 DB 타입:", dbType);
        fetchUserDBsUnderMyNetwork(limit, offset, true, dbType);
      }

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
    }
  }, [currentPage, isSearching]);

  const handleSearch = () => {
    const filters: any = {
      [filterType]: searchKeyword.trim(),
    };

    //console.log("검색 필터:", filters);

    setIsSearching(true); // ✅ 검색 상태로 전환
    setCurrentPage(1); // ✅ 검색은 항상 1페이지부터 시작
    searchUserDBsWithOr(limit, 0, filters); // offset = 0
  };

  const handleCreateDB = async () => {
    if (pageType === "company") {
      fetchUserDBsForMainUser(limit, offset);
    } else if (pageType === "unallocated") {
      fetchUserDBsByMyUsername(limit, offset, true);
    } else if (pageType === "allocated") {
      fetchUserDBsUnderMyNetwork(limit, offset, false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      alert("삭제할 사용자를 선택하세요.");
      return;
    }

    const confirmed = window.confirm("선택된 사용자를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await Promise.all(selectedUsers.map((user) => deleteUserDB(user.id)));
      alert("삭제 완료");
      setSelectedUsers([]);
      fetchUserDBsUnderMyNetwork(); // 필요 시 limit/offset 추가
    } catch (err) {
      alert("삭제 실패");
      console.error(err);
    }
  };

  const handleMemoUpdated = () => {
    console.log("Memo updated, refreshing user list...");
    if (pageType === "company") {
      fetchUserDBsForMainUser(limit, offset);
    } else if (pageType === "unallocated") {
      fetchUserDBsByMyUsername(limit, offset, true);
    } else if (pageType === "allocated") {
      fetchUserDBsUnderMyNetwork(limit, offset, false);
    } else {
      fetchUserDBsUnderMyNetwork(limit, offset, true, dbType);
    }
  };

  const handleAssignManager = async (manager: string) => {
    try {
      await Promise.all(
        selectedUsers.map((user) => updateUserDB(user.id, { ...user, manager }))
      );
      alert("담당자 배정 완료");
      handleMemoUpdated(); // ✅ 리스트 갱신
    } catch (error) {
      console.error("담당자 배정 실패:", error);
      alert("담당자 배정 중 오류 발생");
    }
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

      {pageType === "company" && (
        <UserDBAddActions
          onOpenCreateModal={() => setShowCreateModal(true)}
          onDeleteSelected={handleDeleteSelected}
          selectedUsers={selectedUsers}
          refresh={() => fetchUserDBsForMainUser(limit, offset)}
        />
      )}

      {(pageType === "unallocated" ||
        pageType === "allocated" ||
        pageType === "company") &&
        managerList.length > 0 && (
          <AssignManagerActions
            managers={managerList}
            selectedUsers={selectedUsers}
            onAssignManager={handleAssignManager}
          />
        )}

      {showCreateModal && (
        <CreateUserDBModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreateDB}
        />
      )}

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
            onSelectedUsersChange={setSelectedUsers}
            onMemoUpdated={handleMemoUpdated}
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
