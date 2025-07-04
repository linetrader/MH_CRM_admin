// src/components/common/Pagination.tsx

import React from "react";
import { Box, Button } from "@mui/material";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  const getPagesToShow = () => {
    const pages = new Set<number>();

    pages.add(1);
    pages.add(totalPages);

    if (currentPage > 2) pages.add(currentPage - 1);
    pages.add(currentPage);
    if (currentPage < totalPages - 1) pages.add(currentPage + 1);

    return Array.from(pages).sort((a, b) => a - b);
  };

  const pagesToShow = getPagesToShow();
  let lastPage = 0;

  return (
    <Box mt={3} display="flex" justifyContent="center" alignItems="center">
      <Button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        sx={{
          color: currentPage === 1 ? "#aaa" : "#555",
          borderColor: "#ccc",
        }}
      >
        이전
      </Button>

      {pagesToShow.map((page) => {
        const isEllipsis = page - lastPage > 1;
        const render = (
          <Button
            key={page}
            variant={currentPage === page ? "contained" : "outlined"}
            color={currentPage === page ? "primary" : "inherit"}
            disabled={currentPage === page}
            onClick={() => setCurrentPage(page)}
            sx={{
              color: currentPage === page ? "#fff" : "#555",
              borderColor: "#ccc",
              backgroundColor: currentPage === page ? "#1976d2" : "transparent",
              "&:hover": {
                backgroundColor: currentPage === page ? "#1976d2" : "#f1f1f1",
              },
            }}
          >
            {page}
          </Button>
        );
        const ellipsis =
          isEllipsis && lastPage !== 0 ? (
            <Button key={`ellipsis-${page}`} disabled sx={{ minWidth: 36 }}>
              ...
            </Button>
          ) : null;

        lastPage = page;
        return (
          <React.Fragment key={`fragment-${page}`}>
            {ellipsis}
            {render}
          </React.Fragment>
        );
      })}

      <Button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        sx={{
          color: currentPage === totalPages ? "#aaa" : "#555",
          borderColor: "#ccc",
        }}
      >
        다음
      </Button>
    </Box>
  );
}
