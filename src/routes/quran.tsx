import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route — child routes (/quran and /quran/$id) render here.
export const Route = createFileRoute("/quran")({
  component: () => <Outlet />,
});
