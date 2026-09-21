import {
  Flag,
  LayoutPanelLeft,
  Users2,
  Home,
  Ticket,
  UserLock,
  UserPen,
  Waypoints,
  Stethoscope,
  Pill,
  LandPlot,
  Grid2X2Plus,
  ShieldCheck,
  Key,
} from "lucide-react";

const NavData = {
  superadmin: [
    {
      type: "dropdown",
      label: "Event Management",
      icon: LayoutPanelLeft,
      items: [
        { label: "Events", icon: Ticket, href: "/dashboard/events" },
        {
          label: "Type",
          icon: UserLock,
          href: "/dashboard/event-type",
        },
      ],
    },
    {
      type: "dropdown",
      label: "User Management",
      icon: UserPen,
      items: [
        { label: "Users", icon: Users2, href: "/dashboard/users" },
        {
          label: "User-Relation",
          icon: Waypoints,
          href: "/dashboard/users/relation",
        },
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
    {
      type: "dropdown",
      label: "Administration",
      icon: ShieldCheck,
      items: [
        { label: "Roles", icon: Flag, href: "/dashboard/role" },
        { label: "Permissions", icon: Key, href: "/dashboard/permissions" },
      ],
    },
  ],
  other: [
    {
      type: "dropdown",
      label: "Event Management",
      icon: LayoutPanelLeft,
      items: [{ label: "Events", icon: Ticket, href: "/dashboard/events" }],
    },
  ],
};

export default NavData;
