import { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderStatus, TimelineEvent } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'status'>) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, description: string, actor: 'buyer' | 'seller' | 'system') => void;
  refundOrder: (orderId: string, reason: string) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const dummyOrders: Order[] = [
  {
    id: 'ord_001',
    buyerName: 'Alice Johnson',
    buyerEmail: 'alice@example.com',
    sellerName: 'Bob\'s Electronics',
    sellerEmail: 'bob@electronics.com',
    itemName: 'Wireless Headphones',
    itemDescription: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    amount: 299.99,
    deliveryTime: '2026-04-10',
    status: 'shipped',
    createdAt: new Date('2026-04-01'),
    timeline: [
      {
        status: 'created',
        timestamp: new Date('2026-04-01T10:00:00'),
        description: 'Order created by buyer',
        actor: 'buyer'
      },
      {
        status: 'funded',
        timestamp: new Date('2026-04-01T10:05:00'),
        description: 'Funds locked in escrow',
        actor: 'buyer'
      },
      {
        status: 'accepted',
        timestamp: new Date('2026-04-01T14:30:00'),
        description: 'Order accepted by seller',
        actor: 'seller'
      },
      {
        status: 'shipped',
        timestamp: new Date('2026-04-02T09:15:00'),
        description: 'Item shipped - Tracking: TRK123456789',
        actor: 'seller'
      }
    ]
  },
  {
    id: 'ord_002',
    buyerName: 'Charlie Davis',
    buyerEmail: 'charlie@example.com',
    sellerName: 'Fashion Hub',
    sellerEmail: 'sales@fashionhub.com',
    itemName: 'Designer Jacket',
    itemDescription: 'Limited edition leather jacket in black, size M',
    amount: 549.00,
    deliveryTime: '2026-04-08',
    status: 'accepted',
    createdAt: new Date('2026-04-02'),
    timeline: [
      {
        status: 'created',
        timestamp: new Date('2026-04-02T11:20:00'),
        description: 'Order created by buyer',
        actor: 'buyer'
      },
      {
        status: 'funded',
        timestamp: new Date('2026-04-02T11:25:00'),
        description: 'Funds locked in escrow',
        actor: 'buyer'
      },
      {
        status: 'accepted',
        timestamp: new Date('2026-04-02T16:00:00'),
        description: 'Order accepted by seller',
        actor: 'seller'
      }
    ]
  },
  {
    id: 'ord_003',
    buyerName: 'Diana Martinez',
    buyerEmail: 'diana@example.com',
    sellerName: 'Tech Gadgets Pro',
    sellerEmail: 'support@techgadgets.com',
    itemName: 'Smart Watch Series 5',
    itemDescription: 'Advanced fitness tracking, heart rate monitor, GPS enabled',
    amount: 399.99,
    deliveryTime: '2026-04-12',
    status: 'completed',
    createdAt: new Date('2026-03-25'),
    timeline: [
      {
        status: 'created',
        timestamp: new Date('2026-03-25T09:00:00'),
        description: 'Order created by buyer',
        actor: 'buyer'
      },
      {
        status: 'funded',
        timestamp: new Date('2026-03-25T09:10:00'),
        description: 'Funds locked in escrow',
        actor: 'buyer'
      },
      {
        status: 'accepted',
        timestamp: new Date('2026-03-25T13:00:00'),
        description: 'Order accepted by seller',
        actor: 'seller'
      },
      {
        status: 'shipped',
        timestamp: new Date('2026-03-26T08:00:00'),
        description: 'Item shipped - Tracking: TRK987654321',
        actor: 'seller'
      },
      {
        status: 'delivered',
        timestamp: new Date('2026-03-28T14:30:00'),
        description: 'Delivery confirmed by buyer',
        actor: 'buyer'
      },
      {
        status: 'completed',
        timestamp: new Date('2026-03-28T14:31:00'),
        description: 'Payment released to seller',
        actor: 'system'
      }
    ]
  },
  {
    id: 'ord_004',
    buyerName: 'Ethan Wilson',
    buyerEmail: 'ethan@example.com',
    sellerName: 'Home Decor Plus',
    sellerEmail: 'info@homedecor.com',
    itemName: 'Modern Floor Lamp',
    itemDescription: 'Minimalist design with adjustable brightness and color temperature',
    amount: 159.99,
    deliveryTime: '2026-04-15',
    status: 'funded',
    createdAt: new Date('2026-04-03'),
    timeline: [
      {
        status: 'created',
        timestamp: new Date('2026-04-03T15:45:00'),
        description: 'Order created by buyer',
        actor: 'buyer'
      },
      {
        status: 'funded',
        timestamp: new Date('2026-04-03T15:50:00'),
        description: 'Funds locked in escrow',
        actor: 'buyer'
      }
    ]
  }
];

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${generateId()}`,
      status: 'created',
      createdAt: new Date(),
      timeline: [
        {
          status: 'created',
          timestamp: new Date(),
          description: 'Order created by buyer',
          actor: 'buyer'
        }
      ]
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    description: string,
    actor: 'buyer' | 'seller' | 'system'
  ) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const newEvent: TimelineEvent = {
            status: newStatus,
            timestamp: new Date(),
            description,
            actor
          };
          return {
            ...order,
            status: newStatus,
            timeline: [...order.timeline, newEvent]
          };
        }
        return order;
      })
    );
  };

  const refundOrder = (orderId: string, reason: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const newEvent: TimelineEvent = {
            status: 'refunded',
            timestamp: new Date(),
            description: `Order refunded - Reason: ${reason}`,
            actor: 'system'
          };
          return {
            ...order,
            status: 'refunded',
            disputeReason: reason,
            timeline: [...order.timeline, newEvent]
          };
        }
        return order;
      })
    );
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        refundOrder,
        getOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
