"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    loading,
    error,
  } = useLogin();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        bgcolor="white"
        p={4}
        borderRadius={2}
        boxShadow={3}
        width={400}
        textAlign="center"
      >
        <Typography variant="h5" mb={3}>
          Admin Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
