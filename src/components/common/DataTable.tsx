// src/components/common/DataTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Checkbox,
} from "@mui/material";

interface ColumnDefinition<T> {
  key: keyof T | "actions";
  label: string;
  format?: (value: T[keyof T] | undefined, row?: T) => string | JSX.Element;
  isAction?: boolean;
  userLevel?: number; // 추가: 사용자 레벨에 따라 표시 여부 결정
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  onAction?: (row: T) => void;
  actionLabel?: string;
  selectedRows: T[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (checked: boolean, row: T) => void;
}

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onAction,
  actionLabel = "수정",
  selectedRows,
  onSelectAll,
  onSelectRow,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedRows.length === data.length;

  return (
    <Table
      size="small" // ✅ 전체 테이블을 compact하게
      sx={{
        "& .MuiTableCell-root": {
          color: "#333",
          py: 0.5, // ✅ 각 셀의 상하 padding을 줄임
          fontSize: "0.75rem", // ✅ 폰트 크기를 작게
        },
        "& .MuiTableRow-root:nth-of-type(even)": {
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </TableCell>
          {columns.map((column) => (
            <TableCell key={String(column.key)}>{column.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedRows.some((r) => r.id === row.id)}
                onChange={(e) => onSelectRow(e.target.checked, row)}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                {column.isAction
                  ? onAction && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onAction(row)}
                      >
                        {actionLabel}
                      </Button>
                    )
                  : column.key === "createdAt" || column.key === "updatedAt"
                  ? new Date(
                      Number(row[column.key as keyof T])
                    ).toLocaleString()
                  : column.format
                  ? column.format(row[column.key as keyof T], row)
                  : String(row[column.key as keyof T] ?? "")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
