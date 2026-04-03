import { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { ArrowLeft, CheckCircle2, Clock, Package, Truck as TruckIcon, XCircle, User, DollarSign, Calendar, FileText } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

const OrderDetail = ({ orderId, onBack }: OrderDetailProps) => {
  const { getOrder, updateOrderStatus, refundOrder } = useOrders();
  const order = getOrder(orderId);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Order not found</p>
        <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mt-4">
          Back to Orders
        </button>
      </div>
    );
  }

  const statusFlow: OrderStatus[] = [
    'created',
    'funded',
    'accepted',
    'shipped',
    'delivered',
    'completed'
  ];

  const currentStepIndex = statusFlow.indexOf(order.status);

  const getStatusIcon = (status: OrderStatus, index: number) => {
    const isCompleted = index < currentStepIndex;
    const isCurrent = index === currentStepIndex;
    const isRefunded = order.status === 'refunded';

    if (isRefunded && isCurrent) {
      return <XCircle className="w-6 h-6 text-red-600" />;
    }
    if (isCompleted) {
      return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    }
    if (isCurrent) {
      return <Clock className="w-6 h-6 text-blue-600" />;
    }
    return <div className="w-6 h-6 rounded-full border-2 border-slate-300" />;
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'fund':
        updateOrderStatus(orderId, 'funded', 'Funds locked in escrow', 'buyer');
        break;
      case 'accept':
        updateOrderStatus(orderId, 'accepted', 'Order accepted by seller', 'seller');
        break;
      case 'ship':
        const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        updateOrderStatus(
          orderId,
          'shipped',
          `Item shipped - Tracking: ${trackingNumber}`,
          'seller'
        );
        break;
      case 'confirm':
        updateOrderStatus(orderId, 'delivered', 'Delivery confirmed by buyer', 'buyer');
        updateOrderStatus(orderId, 'completed', 'Payment released to seller', 'system');
        break;
      case 'refund':
        setShowRefundModal(true);
        break;
    }
  };

  const handleRefund = () => {
    if (refundReason.trim()) {
      refundOrder(orderId, refundReason);
      setShowRefundModal(false);
      setRefundReason('');
    }
  };

  const getAvailableActions = () => {
    const actions = [];
    if (order.status === 'created') {
      actions.push({ label: 'Lock Funds in Escrow', action: 'fund', variant: 'primary' });
    }
    if (order.status === 'funded') {
      actions.push({ label: 'Accept Order', action: 'accept', variant: 'primary' });
      actions.push({ label: 'Refund Order', action: 'refund', variant: 'danger' });
    }
    if (order.status === 'accepted') {
      actions.push({ label: 'Mark as Shipped', action: 'ship', variant: 'primary' });
      actions.push({ label: 'Refund Order', action: 'refund', variant: 'danger' });
    }
    if (order.status === 'shipped') {
      actions.push({ label: 'Confirm Delivery', action: 'confirm', variant: 'primary' });
      actions.push({ label: 'Refund Order', action: 'refund', variant: 'danger' });
    }
    return actions;
  };

  const actions = getAvailableActions();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </button>

      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{order.itemName}</h1>
            <p className="text-slate-600 mt-1">Order ID: {order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900">${order.amount.toFixed(2)}</p>
            <p className={`text-sm mt-1 capitalize font-medium ${
              order.status === 'completed' ? 'text-green-600' :
              order.status === 'refunded' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {order.status}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Buyer</p>
                <p className="text-slate-900 font-medium">{order.buyerName}</p>
                <p className="text-sm text-slate-600">{order.buyerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Item Description</p>
                <p className="text-slate-900">{order.itemDescription}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Seller</p>
                <p className="text-slate-900 font-medium">{order.sellerName}</p>
                <p className="text-sm text-slate-600">{order.sellerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Expected Delivery</p>
                <p className="text-slate-900">{order.deliveryTime}</p>
              </div>
            </div>
          </div>
        </div>

        {order.status !== 'refunded' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Progress</h2>
            <div className="relative">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200" />
              <div
                className="absolute top-6 left-0 h-0.5 bg-blue-600 transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (statusFlow.length - 1)) * 100}%`
                }}
              />
              <div className="relative flex justify-between">
                {statusFlow.map((status, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted
                            ? 'bg-green-100'
                            : isCurrent
                            ? 'bg-blue-100'
                            : 'bg-slate-100'
                        }`}
                      >
                        {getStatusIcon(status, index)}
                      </div>
                      <p
                        className={`text-xs font-medium capitalize ${
                          isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {actions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Actions</h2>
            <div className="flex flex-wrap gap-3">
              {actions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleAction(action.action)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    action.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Timeline</h2>
          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.status === 'refunded'
                        ? 'bg-red-100'
                        : event.status === 'completed'
                        ? 'bg-green-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {event.status === 'refunded' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : event.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : event.status === 'shipped' ? (
                      <TruckIcon className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  {index < order.timeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-slate-200 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900 capitalize">
                      {event.status}
                    </p>
                    <span className="text-xs text-slate-500">
                      by {event.actor}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">{event.description}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Refund Order</h3>
            <p className="text-slate-600 mb-4">
              Please provide a reason for the refund. This action cannot be undone.
            </p>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Enter refund reason..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={!refundReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
