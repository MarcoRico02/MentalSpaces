import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({
  to,
  icon: Icon,
  children,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const classes = `flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${
    isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  }`;

  return (
    <Link to={to}>
      <div className={classes}>
        <Icon className="h-5 w-5" />
        <span className="font-medium">{children}</span>
      </div>
    </Link>
  );
};
