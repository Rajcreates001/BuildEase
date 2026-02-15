import { useState, useEffect } from 'react';
import { getMarketplaceItems } from '../../api/axios';
import toast from 'react-hot-toast';

export default function Marketplace() {
  const [brand, setBrand] = useState('indian');
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems(brand);
  }, [brand]);

  const fetchItems = async (brandType) => {
    setLoading(true);
    try {
      const { data } = await getMarketplaceItems({ brand: brandType });
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(cart.map((c) => (c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart!`);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Materials Marketplace</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-400">🛒 Cart: {totalItems} items</span>
          <div className="flex border border-gray-600 rounded-lg p-1">
            <button onClick={() => setBrand('indian')}
              className={`px-3 sm:px-4 py-1 rounded-md text-xs sm:text-sm font-semibold transition ${brand === 'indian' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300'}`}>
              Indian
            </button>
            <button onClick={() => setBrand('foreign')}
              className={`px-3 sm:px-4 py-1 rounded-md text-xs sm:text-sm font-semibold transition ${brand === 'foreign' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300'}`}>
              Foreign
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading items...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="glass-card rounded-xl overflow-hidden">
              <img src={item.image || 'https://placehold.co/300x300/374151/fef08a?text=Item'} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold neon-yellow-text">₹{item.price?.toLocaleString('en-IN')}/{item.unit}</span>
                  <button onClick={() => addToCart(item)} className="px-4 py-1 bg-yellow-400/20 text-yellow-300 text-sm font-semibold rounded-md hover:bg-yellow-400/30">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
