export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface HomeNavItem extends NavItemWithChildren {}

export interface SidebarNavItem extends NavItemWithChildren {}
