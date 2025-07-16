// src/app/dashboard/All/userDB-management/components/UserDBAddActions.tsx

"use client";

import { Button, Stack } from "@mui/material";
import * as XLSX from "xlsx";
import { useFetchUsersDB } from "@/hooks/useFetchUsersDB";

interface Props {
  onOpenCreateModal: () => void;
  onDeleteSelected: () => void;
  selectedUsers: UserDB[];
  refresh: () => void;
}

export default function UserDBAddActions({
  onOpenCreateModal,
  onDeleteSelected,
  selectedUsers,
  refresh,
}: Props) {
  const { createUserDB } = useFetchUsersDB();

  const parseExcelDate = (value: any): string => {
    if (!value) return "";
    if (typeof value === "number") {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      return date.toISOString().split("T")[0];
    }
    const parsed = new Date(value);
    return !isNaN(parsed.getTime()) ? parsed.toISOString().split("T")[0] : "";
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
          if (!row.phonenumber) continue;

          const phone = row.phonenumber?.toString().trim() || "";

          const result = await createUserDB({
            username: row.username || "",
            phonenumber: phone,
            sms: row.sms || "",
            incomepath: row.incomepath || "",
            creatorname: row.creatorname || "",
            memo: String(row.memo || ""),
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

        refresh();
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
    <Stack direction="row" spacing={2} mb={2} alignItems="center">
      <Button variant="contained" color="primary" onClick={onOpenCreateModal}>
        DB 수동 추가
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          const fileInput = document.getElementById(
            "excel-upload"
          ) as HTMLInputElement;
          fileInput?.click();
        }}
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

      <Button variant="contained" color="error" onClick={onDeleteSelected}>
        선택 삭제
      </Button>
    </Stack>
  );
}
