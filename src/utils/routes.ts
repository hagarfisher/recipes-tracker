export enum RouteNames {
  HOME = "Home",
  ADMIN = "Admin",
  PROFILE = "Profile",
  ANALYTICS = "Analytics",
}

export const navLinks = [
  { name: RouteNames.HOME, path: "/" },
  {
    name: RouteNames.ANALYTICS,
    path: "/analytics",
  },
  // {
  //   name: RouteNames.ADMIN,
  //   path: "/admin",
  // },
];
