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
      { label: "Type/Permission", icon: UserLock, href: "/dashboard/permission" },
    ],
  },
  {
    type: "dropdown",
    label: "User Management",
    icon: UserPen,
    items: [
      { label: "Users", icon: Users2, href: "/dashboard/users" },
      { label: "Role", icon: Flag, href: "#" },
      { label: "User-Relation", icon: Waypoints, href: "#" },
    ],
  },
  {
    type: "dropdown",
    label: "Others",
    icon: Grid2X2Plus,
    items: [
      { label: "Doctors", icon: Stethoscope, href: "/dashboard/doctors" },
      { label: "Product", icon: Pill, href: "/dashboard/products" },
      { label: "Area", icon: LandPlot, href: "/dashboard/area" },
    ],
  },
];

export default NavData;
