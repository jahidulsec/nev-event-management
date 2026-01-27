import { Calendars, FileLock, Layout, Pill, Stethoscope, Users2 } from "lucide-react";

export const navlist = {
  superadmin: [
    {
      id: 1,
      title: "Dashboard",
      url: "/dashboard",
      icon: Layout,
    },
    {
      id: 2,
      title: "Events",
      url: "/dashboard/events",
      icon: Calendars,
    },
    {
      id: 3,
      title: "Permissions",
      url: "/dashboard/permission",
      icon: FileLock,
    },
    {
      id: 4,
      title: "Doctors",
      url: "/dashboard/doctors",
      icon: Stethoscope,
    },
    {
      id: 5,
      title: "Products",
      url: "/dashboard/products",
      icon: Pill,
    },
    {
      id: 6,
      title: "Employees",
      url: "/dashboard/employees",
      icon: Users2,
    },
  ],
};
