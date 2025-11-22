"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { AuthForm } from "@/components/auth/AuthForm";
import { useRegister } from "@/hooks/useAuth";
import { type RegisterInput } from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync, isPending, error } = useRegister();

  return (
    <main>
      <Stack alignItems="center" justifyContent="center" minHeight="100vh" px={2}>
        <Card sx={{ width: "100%", maxWidth: 420 }}>
          <CardContent>
            <AuthForm
              mode="register"
              isLoading={isPending}
              error={error?.message ?? null}
              onSubmit={async (values) => {
                await mutateAsync(values as RegisterInput);
                router.replace("/main");
              }}
            />
            <Typography variant="body2" mt={3} textAlign="center">
              Already have an account? <Link href="/login">Sign in</Link>
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </main>
  );
}
