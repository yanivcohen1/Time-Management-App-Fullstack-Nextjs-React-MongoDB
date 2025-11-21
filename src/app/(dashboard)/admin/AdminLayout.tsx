"use client";

import { ReactNode, createContext, useContext, useMemo, useRef, useState } from "react";
import { Box, Button, CircularProgress, FormControlLabel, Paper, Stack, Switch, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { BreadCrumb } from "primereact/breadcrumb";
import { MenuItem } from "primereact/menuitem";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useSession } from "@/hooks/useAuth";
import { tokenStorage } from "@/lib/http/token-storage";

interface AdminLayoutProps {
  children: ReactNode;
}

type AdminSwitchContextValue = {
  interWorkspaceEnabled: boolean;
  setInterWorkspaceEnabled: (enabled: boolean) => void;
};

const AdminSwitchContext = createContext<AdminSwitchContextValue | undefined>(undefined);

export function useAdminSwitch() {
  const context = useContext(AdminSwitchContext);
  if (!context) {
    throw new Error("useAdminSwitch must be used within the admin layout");
  }
  return context;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isLoading: sessionLoading, isError: sessionError } = useSession();
  const hasToken = !!tokenStorage.getAccessToken();
  const [interWorkspaceEnabled, setInterWorkspaceEnabled] = useState(false);
  const [activeView, setActiveView] = useState<"admin" | "user">(() => (pathname?.includes("/user/") ? "user" : "admin"));
  const resolvedActiveView = pathname?.startsWith("/admin") ? (pathname.includes("/user/") ? "user" : "admin") : activeView;
  const transitionKey = pathname ?? resolvedActiveView;
  const transitionRef = useRef<HTMLDivElement>(null);

  const breadcrumbItems: MenuItem[] = useMemo(
    () => [
      {
        label: "Admin",
        icon: "pi pi-shield",
        command: () => {
          setActiveView("admin");
          router.push("/admin/1");
        }
      },
      {
        label: "User",
        icon: "pi pi-user",
        command: () => {
          setActiveView("user");
          router.push("/admin/3/user/2?id=1&name=yar");
        }
      }
    ],
    [router]
  );

  const home: MenuItem = useMemo(
    () => ({
      icon: <span className="pi pi-home" aria-label="Home" />,
      url: "/"
    }),
    []
  );

  if ((!hasToken || sessionError) && !sessionLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh" spacing={2}>
        <Typography variant="h5">Please sign in to access the admin console.</Typography>
        <Button href="/login" variant="contained">
          Go to login
        </Button>
      </Stack>
    );
  }

  if (sessionLoading || !session) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh">
        <CircularProgress />
      </Stack>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh" spacing={2}>
        <Typography variant="h5">You do not have access to the admin console.</Typography>
        <Button href="/todo" variant="contained">
          Go to todos
        </Button>
      </Stack>
    );
  }

  return (
    <AdminSwitchContext.Provider value={{ interWorkspaceEnabled, setInterWorkspaceEnabled }}>
      <main>
        <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <BreadCrumb home={home} model={breadcrumbItems} />
            </Paper>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack spacing={1}>
                <Typography variant="h3" fontWeight={700}>
                  Admin console
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage roles, enforce rate limits, and review access logs across the workspace.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently viewing: {resolvedActiveView === "admin" ? "Admin overview" : "User details"}
                </Typography>
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={interWorkspaceEnabled}
                    onChange={(_, checked) => setInterWorkspaceEnabled(checked)}
                  />
                }
                label={interWorkspaceEnabled ? "User workspace enabled" : "User workspace disabled"}
              />
            </Stack>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Stack spacing={1.5}>
                <Typography variant="h6">Security overview</Typography>
                <Typography variant="body2" color="text.secondary">
                  Surface guardrail metrics, API quotas, and access history here as data sources become available.
                </Typography>
              </Stack>
            </Paper>

            <SwitchTransition mode="out-in">
              <CSSTransition key={transitionKey} nodeRef={transitionRef} classNames="slide" timeout={{ enter: 500, exit: 500 }} unmountOnExit appear>
                <div ref={transitionRef}>{children}</div>
              </CSSTransition>
            </SwitchTransition>
          </Stack>
        </Box>
      </main>
    </AdminSwitchContext.Provider>
  );
}
