import {
  LayoutDashboard,
  Building2,
  Users,
  FolderKanban,
  TimerReset,
  CheckSquare,
  BarChart3,
  Settings,
} from "lucide-react";

export const sidebarLinks = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Organizations",
    path: "/organizations",
    icon: Building2,
  },
  {
    name: "Teams",
    path: "/teams",
    icon: Users,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Sprints",
    path: "/sprints",
    icon: TimerReset,
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
