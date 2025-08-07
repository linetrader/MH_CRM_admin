"use client";

import React, { useState } from "react";
import {
  Dashboard,
  Logout,
  Group,
  Storage,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/context/AuthContext";

const drawerWidth = 240;

const allMenuItems = [
  { label: "Dashboard", icon: <Dashboard />, path: "/dashboard", level: 5 },
  {
    label: "전체",
    icon: <Group />,
    level: 4,
    children: [
      {
        label: "영업팀 관리",
        icon: <Group />,
        path: "/dashboard/All/user-management",
        level: 4,
      },
      {
        label: "본사 DB 관리",
        icon: <Storage />,
        path: "/dashboard/All/userDB-company",
        level: 2,
      },
      {
        label: "미배분 DB 관리",
        icon: <Storage />,
        path: "/dashboard/All/userDB-unallocated",
        level: 3,
      },
      {
        label: "배분 DB 관리",
        icon: <Storage />,
        path: "/dashboard/All/userDB-allocated",
        level: 3,
      },
    ],
  },
  {
    label: "주식 DB",
    icon: <Storage />,
    level: 5,
    children: [
      {
        label: "신규 DB",
        icon: <Storage />,
        path: "/dashboard/stock/new",
        level: 5,
      },
      {
        label: "구 DB",
        icon: <Storage />,
        path: "/dashboard/stock/old",
        level: 5,
      },
    ],
  },
  {
    label: "코인 DB",
    icon: <Storage />,
    level: 5,
    children: [
      {
        label: "신규 DB",
        icon: <Storage />,
        path: "/dashboard/coin/new",
        level: 5,
      },
      {
        label: "구 DB",
        icon: <Storage />,
        path: "/dashboard/coin/old",
        level: 5,
      },
    ],
  },
  {
    label: "가망 DB",
    icon: <Storage />,
    level: 5,
    children: [
      {
        label: "가망 DB",
        icon: <Storage />,
        path: "/dashboard/potential/new",
        level: 5,
      },
    ],
  },
  {
    label: "기가입 DB",
    icon: <Storage />,
    level: 5,
    children: [
      {
        label: "펀드1 (도지 채굴기)",
        icon: <Storage />,
        path: "/dashboard/customer/fund1",
        level: 5,
      },
      {
        label: "펀드2 (데이터 센터)",
        icon: <Storage />,
        path: "/dashboard/customer/fund2",
        level: 5,
      },
      {
        label: "펀드3 (VAST)",
        icon: <Storage />,
        path: "/dashboard/customer/fund3",
        level: 5,
      },
    ],
  },
  {
    label: "블랙 DB",
    icon: <Storage />,
    level: 5,
    children: [
      {
        label: "부재",
        icon: <Storage />,
        path: "/dashboard/black/longterm",
        level: 5,
      },
      {
        label: "단선",
        icon: <Storage />,
        path: "/dashboard/black/notIdentity",
        level: 5,
      },
      {
        label: "결번",
        icon: <Storage />,
        path: "/dashboard/black/wrongnumber",
        level: 5,
      },
    ],
  },
  {
    label: "기타 DB",
    icon: <Storage />,
    path: "/dashboard/els",
    level: 5,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userLevel } = useLogin();
  const { logout } = useAuth();

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const filteredMenuItems = userLevel
    ? allMenuItems.filter((item) => userLevel <= item.level)
    : [];

  const handleLogout = () => {
    logout();
  };

  const handleMenuClick = (item: any) => {
    if (item.children) {
      setOpenSubMenu(openSubMenu === item.label ? null : item.label);
    } else {
      router.push(item.path);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f7f7f7",
          color: "#333",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {filteredMenuItems.map((item) => {
            const isSelected = pathname === item.path;
            const isOpen = openSubMenu === item.label;

            return (
              <React.Fragment key={item.label}>
                <ListItemButton
                  onClick={() => handleMenuClick(item)}
                  sx={{
                    backgroundColor: isSelected ? "#424242" : "inherit",
                    color: isSelected ? "#fff" : "#333",
                    "&:hover": { backgroundColor: "#424242", color: "#fff" },
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? "#fff" : "#333" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {item.children ? (
                    isOpen ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : null}
                </ListItemButton>

                {item.children && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children
                        .filter(
                          (child) =>
                            typeof userLevel === "number" &&
                            userLevel <= child.level
                        )
                        .map((child) => (
                          <ListItemButton
                            key={child.label}
                            sx={{ pl: 4 }}
                            onClick={() => router.push(child.path)}
                          >
                            <ListItemIcon>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.label} />
                          </ListItemButton>
                        ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      <Box>
        <List>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              "&:hover": { backgroundColor: "#e0e0e0" },
              "&.Mui-selected": {
                backgroundColor: "#b71c1c",
                color: "#fff",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#333" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
