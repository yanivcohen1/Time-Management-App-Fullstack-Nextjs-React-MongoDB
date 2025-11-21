"use client";

import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function AdminPage() {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="h4" fontWeight={700}>
          Welcome to the admin console
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use the breadcrumb above to jump straight to the canonical admin record or drill into the linked user profile.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button component={Link} href="/admin/1" variant="contained">
            View admin #1
          </Button>
          <Button component={Link} href="/admin/3/user/2?id=1&name=yar" variant="outlined">
            Jump to user view
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
