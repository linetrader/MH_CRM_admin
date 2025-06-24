import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

interface EditableFieldsProps<T> {
  data: T;
  fields: Array<{ label: string; name: keyof T }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
  loading?: boolean; // ✅ 여기에 추가
  type?: string; // 이미 추가되어 있다면 유지
}

export default function EditableFields<T extends { id: string }>({
  data,
  fields,
  onChange,
  onClose,
  onSave,
}: EditableFieldsProps<T>) {
  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          width: "30%",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="subtitle1" color="textSecondary">
            ID: {data.id}
          </Typography>
          {fields.map(({ label, name }) => (
            <TextField
              key={String(name)}
              label={label}
              name={String(name)}
              value={(data[name] as string) || ""}
              onChange={onChange}
              fullWidth
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          취소
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
