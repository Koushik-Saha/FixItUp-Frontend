import type { Database } from "@/types/database";

type Tables = Database["public"]["Tables"];

export type ProfileRow = Tables["profiles"]["Row"];
export type OrderRow = Tables["orders"]["Row"];
export type ProductRow = Tables["products"]["Row"];
export type OrderItemRow = Tables["order_items"]["Row"];
export type RepairTicketRow = Tables["repair_tickets"]["Row"];
export type WholesaleApplicationRow = Tables["wholesale_applications"]["Row"];
