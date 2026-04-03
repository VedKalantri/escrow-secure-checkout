import { useOrders } from '../context/OrderContext';
import { Plus, Package, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrdersListProps {
  onCreateOrder: () => void;
  onViewOrder: (orderId: string) => void;
}

const OrdersList = ({ onCreateOrder, onViewOrder }: OrdersListProps) => {
  const { orders } = useOrders();

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      created: 'bg-slate-100 text-slate-700',
      funded: 'bg-blue-100 text-blue-700',
      accepted: 'bg-cyan-100 text-cyan-700',
      shipped: 'bg-orange-100 text-orange-700',
      delivered: 'bg-lime-100 text-lime-700',
      completed: 'bg-green-100 text-green-700',
      refunded: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.created;
  };

  const getStatusIcon = (status: OrderStatus) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'refunded') return <XCircle className="w-4 h-4" />;
    if (['shipped', 'delivered'].includes(status)) return <Package className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
          <p className="text-slate-600 mt-1">Manage your escrow transactions</p>
        </div>
        <button
          onClick={onCreateOrder}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Order</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Item
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Buyer
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Seller
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Delivery Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500">No orders yet</p>
                      <button
                        onClick={onCreateOrder}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create your first order
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => onViewOrder(order.id)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-900">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{order.itemName}</p>
                        <p className="text-sm text-slate-500 truncate max-w-xs">
                          {order.itemDescription}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">{order.buyerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">{order.sellerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        ${order.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{order.deliveryTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOrder(order.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
