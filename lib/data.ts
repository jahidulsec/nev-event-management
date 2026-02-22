import { Calendars, FileLock, Layout, Pill, Stethoscope } from "lucide-react";

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
    // {
    //   id: 6,
    //   title: "Employees",
    //   url: "/dashboard/employees",
    //   icon: Users2,
    // },
  ],
  ao: [
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
  ],
  flm: [
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
  ],
  slm: [
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
  ],
  director_sales: [
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
  ],
  franchise_head: [
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
  ],
  ec: [
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
  ],
  marketing: [
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
  ],
};

export const approverTypeList = [
  {
    label: "First",
    value: "first",
  },
  {
    label: "Second",
    value: "second",
  },
  {
    label: "Third",
    value: "third",
  },
  {
    label: "Forth",
    value: "forth",
  },
  {
    label: "Fifth",
    value: "Fifth",
  },
  {
    label: "Final",
    value: "final",
  },
  {
    label: "Budget",
    value: "budget",
  },
];

export const userRoleList = [
  {
    label: "Superadmin",
    value: "superadmin",
  },
  {
    label: "AO",
    value: "ao",
  },
  {
    label: "FLM",
    value: "flm",
  },
  {
    label: "SLM",
    value: "slm",
  },
  {
    label: "Marketing",
    value: "marketing",
  },
  {
    label: "Director",
    value: "director",
  },
  {
    label: "Event Coordinator",
    value: "eo",
  },
];

export const yesNoList = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];
