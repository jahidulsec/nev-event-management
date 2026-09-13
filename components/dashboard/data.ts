import {
  Flag,
  LayoutPanelLeft,
  Users2,
  Home,
  Ticket,
  ListTree,
  UserLock,
  UserPen,
  Waypoints,
  Stethoscope,
  Pill,
  LandPlot,
  Grid2X2Plus,
} from "lucide-react";

const NavData: any[] = [
  {
    type: "",
    label: "Home",
    icon: Home,
    href: '/dashboard'
  },
  {
    type: "dropdown",
    label: "Event Management",
    icon: LayoutPanelLeft,
    items: [
      { label: "Events", icon: Ticket, href: "/dashboard/events" },
      { label: "Type", icon: ListTree, href: "/dashboard/events" },
      { label: "Permission", icon: UserLock, href: "/dashboard/events" },
    ],
  },
  {
    type: "dropdown",
    label: "User Management",
    icon: UserPen,
    items: [
      { label: "Users", icon: Users2, href: "#" },
      { label: "Role", icon: Flag, href: "#" },
      { label: "User-Relation", icon: Waypoints, href: "#" },
    ],
  },
  {
    type: "dropdown",
    label: "Others",
    icon: Grid2X2Plus,
    items: [
      { label: "Doctors", icon: Stethoscope, href: "#" },
      { label: "Product", icon: Pill, href: "#" },
      { label: "Area", icon: LandPlot, href: "#" },
    ],
  },
];

export default NavData;
