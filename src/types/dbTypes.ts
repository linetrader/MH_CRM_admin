// src/constants/dbTypes.ts

export const DB_TYPES = [
  "els",
  "stock_new",
  "stock_old",
  "coin_new",
  "coin_old",
  "potential",
  "customer_fund1",
  "customer_fund2",
  "customer_fund3",
  "black_longterm",
  "black_notIdentity",
  "black_wronnumber",
] as const;

export type DBType = (typeof DB_TYPES)[number];
