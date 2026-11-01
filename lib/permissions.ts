export type UserRole = "owner" | "manager" | "cashier" | "delivery" | "chef" | "accountant";

export interface RolePermissions {
  label: string;
  labelEn: string;
  badgeColor: string;
  defaultRoute: string;
  canViewOrders: boolean;
  canCreateOrder: boolean;
  canUpdateOrderStatus: boolean;
  canDeleteOrder: boolean;
  canViewMenu: boolean;
  canEditMenu: boolean;
  canViewInventory: boolean;
  canEditInventory: boolean;
  canViewExpenses: boolean;
  canAddExpense: boolean;
  canViewReports: boolean;
  canViewFinance: boolean;
  canManageUsers: boolean;
  canViewChat: boolean;
  canViewKitchen: boolean;
  canManageSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: {
    label: "المعلم المايسترو (المالك)",
    labelEn: "Owner",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    defaultRoute: "/dashboard",
    canViewOrders: true,
    canCreateOrder: true,
    canUpdateOrderStatus: true,
    canDeleteOrder: true,
    canViewMenu: true,
    canEditMenu: true,
    canViewInventory: true,
    canEditInventory: true,
    canViewExpenses: true,
    canAddExpense: true,
    canViewReports: true,
    canViewFinance: true,
    canManageUsers: true,
    canViewChat: true,
    canViewKitchen: true,
    canManageSettings: true,
  },
  manager: {
    label: "مدير التشغيل العام",
    labelEn: "Branch Manager",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    defaultRoute: "/dashboard",
    canViewOrders: true,
    canCreateOrder: true,
    canUpdateOrderStatus: true,
    canDeleteOrder: false,
    canViewMenu: true,
    canEditMenu: true,
    canViewInventory: true,
    canEditInventory: true,
    canViewExpenses: true,
    canAddExpense: true,
    canViewReports: true,
    canViewFinance: false,
    canManageUsers: false,
    canViewChat: true,
    canViewKitchen: true,
    canManageSettings: false,
  },
  cashier: {
    label: "كاشير نقطة البيع (POS)",
    labelEn: "Cashier POS",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    defaultRoute: "/cashier",
    canViewOrders: true,
    canCreateOrder: true,
    canUpdateOrderStatus: true,
    canDeleteOrder: false,
    canViewMenu: true,
    canEditMenu: false,
    canViewInventory: false,
    canEditInventory: false,
    canViewExpenses: false,
    canAddExpense: true,
    canViewReports: false,
    canViewFinance: false,
    canManageUsers: false,
    canViewChat: true,
    canViewKitchen: false,
    canManageSettings: false,
  },
  delivery: {
    label: "طيار دليفري سريع",
    labelEn: "Delivery Captain",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    defaultRoute: "/track",
    canViewOrders: true,
    canCreateOrder: false,
    canUpdateOrderStatus: true,
    canDeleteOrder: false,
    canViewMenu: false,
    canEditMenu: false,
    canViewInventory: false,
    canEditInventory: false,
    canViewExpenses: false,
    canAddExpense: false,
    canViewReports: false,
    canViewFinance: false,
    canManageUsers: false,
    canViewChat: true,
    canViewKitchen: false,
    canManageSettings: false,
  },
  chef: {
    label: "شيف التجهيز والتشفية",
    labelEn: "Chef Prep",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    defaultRoute: "/kitchen",
    canViewOrders: true,
    canCreateOrder: false,
    canUpdateOrderStatus: true,
    canDeleteOrder: false,
    canViewMenu: true,
    canEditMenu: false,
    canViewInventory: true,
    canEditInventory: false,
    canViewExpenses: false,
    canAddExpense: false,
    canViewReports: false,
    canViewFinance: false,
    canManageUsers: false,
    canViewChat: true,
    canViewKitchen: true,
    canManageSettings: false,
  },
  accountant: {
    label: "محاسب الخزينة والمصروفات",
    labelEn: "Accountant",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    defaultRoute: "/reports",
    canViewOrders: true,
    canCreateOrder: false,
    canUpdateOrderStatus: false,
    canDeleteOrder: false,
    canViewMenu: false,
    canEditMenu: false,
    canViewInventory: true,
    canEditInventory: false,
    canViewExpenses: true,
    canAddExpense: true,
    canViewReports: true,
    canViewFinance: true,
    canManageUsers: false,
    canViewChat: false,
    canViewKitchen: false,
    canManageSettings: false,
  },
};

export function getPermissions(role?: string): RolePermissions {
  if (!role) return ROLE_PERMISSIONS.cashier;
  const normalized = role.toLowerCase() as UserRole;
  return ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS.cashier;
}
