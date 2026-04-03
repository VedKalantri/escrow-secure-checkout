export type OrderStatus =
  | 'created'
  | 'funded'
  | 'accepted'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'refunded';

export interface TimelineEvent {
  status: OrderStatus;
  timestamp: Date;
  description: string;
  actor: 'buyer' | 'seller' | 'system';
}

export interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerEmail: string;
  itemName: string;
  itemDescription: string;
  amount: number;
  deliveryTime: string;
  status: OrderStatus;
  createdAt: Date;
  timeline: TimelineEvent[];
  disputeReason?: string;
}

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalValue: number;
  escrowedValue: number;
}
