import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route — /azkar (index) and /azkar/$id render here.
export const Route = createFileRoute("/azkar")({
  component: () => <Outlet />,
});
