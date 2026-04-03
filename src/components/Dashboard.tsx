import { useOrders } from '../context/OrderContext';
import { DashboardStats } from '../types';
import { TrendingUp, Package, CheckCircle2, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { orders } = useOrders();

  const stats: DashboardStats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(o => !['completed', 'refunded'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
    escrowedValue: orders
      .filter(o => !['completed', 'refunded'].includes(o.status))
      .reduce((sum, o) => sum + o.amount, 0)
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Completed',
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Escrowed Value',
      value: `$${stats.escrowedValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-slate-50 text-slate-600',
      iconBg: 'bg-slate-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your escrow transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {orders.slice(0, 5).map(order => {
            const lastEvent = order.timeline[order.timeline.length - 1];
            return (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{order.itemName}</p>
                  <p className="text-sm text-slate-600">
                    {lastEvent.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-slate-900">${order.amount.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 capitalize">{order.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
