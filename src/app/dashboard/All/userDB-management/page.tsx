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
import CreateUserDBModal from "./CreateUserDBModal";
import * as XLSX from "xlsx";
import UserDBAddActions from "@/components/UserDBAddActions";
import UserDBTypeChangeActions from "@/components/UserDBTypeChangeActions";
import UserDBSearchBar from "@/components/UserDBSearchBar";
import AssignManagerActions from "@/components/AssignManagerActions";

export default function UserDBManagementPage() {
  const {
    users,
    totalUsers,
    loading,
    error,
    fetchUsersDB,
    deleteUserDB,
    createUserDB,
    updateUserDB,
    fetchUsernamesUnderMyNetwork,
  } = useFetchUsersDB();

  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserDB[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("phonenumber");
  const [filteredUsers, setFilteredUsers] = useState<UserDB[]>([]);
  const [newDBType, setNewDBType] = useState("");
  const [managerList, setManagerList] = useState<string[]>([]); // 👈 담당자 리스트

  const limit = 30;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    fetchUsersDB(limit, offset);
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
      fetchUsersDB(limit, offset);
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
      fetchUsersDB(limit, offset);
    } catch (error) {
      alert("담당자 배정 중 오류가 발생했습니다.");
      console.error("담당자 배정 실패:", error);
    }
  };

  // 날짜 형식을 안전하게 변환하는 함수
  const parseExcelDate = (value: any): string => {
    if (!value) return "";

    // Excel 날짜 코드 (숫자)인 경우
    if (typeof value === "number") {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel 시작일
      const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
      return date.toISOString().split("T")[0]; // yyyy-mm-dd
    }

    // Date 객체인 경우
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value.toISOString().split("T")[0];
    }

    // 문자열일 경우
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }

    return ""; // 유효하지 않은 경우 빈 문자열 반환
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
          console.log(row.incomedate, parseExcelDate(row.incomedate));
          const result = await createUserDB({
            username: row.username || "",
            phonenumber: row.phonenumber?.toString() || "",
            sex: row.sex || "",
            incomepath: row.incomepath || "",
            creatorname: row.creatorname || "",
            memo: row.memo || "",
            type: row.type || "els",
            manager: row.manager || "",
            incomedate: parseExcelDate(row.incomedate) || "",
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

      <UserDBSearchBar
        filterType={filterType}
        setFilterType={setFilterType}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearch={handleSearch}
      />

      <UserDBAddActions
        onOpenCreateModal={() => setShowCreateModal(true)}
        onExcelUploadClick={() =>
          document.getElementById("excel-upload")?.click()
        }
        onDeleteSelected={handleDeleteSelected}
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

      <input
        id="excel-upload"
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleExcelUpload}
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

      {showCreateModal && (
        <CreateUserDBModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchUsersDB(limit, offset)}
        />
      )}
    </Box>
  );
}
