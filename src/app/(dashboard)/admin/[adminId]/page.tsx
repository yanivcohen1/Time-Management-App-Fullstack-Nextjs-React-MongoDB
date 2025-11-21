"use client";

import { Paper, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function AdminDetailsPage() {
  const params = useParams<{ adminId?: string }>();
  const adminId = params?.adminId ?? "Unknown";

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="h4" fontWeight={700}>
          Admin view
        </Typography>
        <Typography variant="body1">Displaying admin id: {adminId}</Typography>
        <Typography variant="body2" color="text.secondary">
          Use the breadcrumb actions above to jump between the admin record at /admin/1 and the user details view.
        </Typography>
      </Stack>
    </Paper>
  );
}
