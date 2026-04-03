import { useState } from 'react';
import { OrderProvider } from './context/OrderContext';
import Dashboard from './components/Dashboard';
import OrdersList from './components/OrdersList';
import CreateOrder from './components/CreateOrder';
import OrderDetail from './components/OrderDetail';
import { LayoutDashboard, Package, ShieldCheck } from 'lucide-react';

type View = 'dashboard' | 'orders' | 'create-order' | 'order-detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('order-detail');
  };

  const handleCreateOrderSuccess = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('order-detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return (
          <OrdersList
            onCreateOrder={() => setCurrentView('create-order')}
            onViewOrder={handleViewOrder}
          />
        );
      case 'create-order':
        return (
          <CreateOrder
            onBack={() => setCurrentView('orders')}
            onSuccess={handleCreateOrderSuccess}
          />
        );
      case 'order-detail':
        return selectedOrderId ? (
          <OrderDetail
            orderId={selectedOrderId}
            onBack={() => setCurrentView('orders')}
          />
        ) : null;
      default:
        return <Dashboard />;
    }
  };

  return (
    <OrderProvider>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  Escrow Platform
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentView('orders')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'orders' ||
                    currentView === 'create-order' ||
                    currentView === 'order-detail'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Orders</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8">{renderContent()}</main>
      </div>
    </OrderProvider>
  );
}

export default App;
