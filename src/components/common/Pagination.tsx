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
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
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
