import { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import { getOrders } from '../api/axios';

export default function Billing() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getOrders();
        setTransactions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Billing & Payments</h2>
      <GlassCard className="p-8">
        <h3 className="font-bold text-lg mb-4">Transaction History</h3>
        {loading ? (
          <p className="text-gray-400 text-center py-6">Loading transactions...</p>
        ) : transactions.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-sm text-gray-400">
                <th className="py-2">Date</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-gray-800">
                  <td className="py-3">{new Date(t.createdAt || t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="py-3">{t.items?.map(i => i.name).join(', ') || t.description || 'Order'}</td>
                  <td className="py-3 text-right">₹{(t.totalAmount || t.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${t.status === 'delivered' || t.status === 'completed' ? 'bg-green-500/20 text-green-300' : t.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {t.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center py-6">No transactions yet. Orders placed in the Marketplace will appear here.</p>
        )}
      </GlassCard>
    </div>
  );
}
