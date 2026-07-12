import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route — /khutbah (index) and /khutbah/$id render here.
export const Route = createFileRoute("/khutbah")({
  component: () => <Outlet />,
});
