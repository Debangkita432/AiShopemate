import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const sampleProducts = [
  { id: 1, name: "Red Dress", image: "/dress1.jpg", price: 2500 },
  { id: 2, name: "Blue Jeans", image: "/jeans1.jpg", price: 1800 },
  { id: 3, name: "Sneakers", image: "/sneakers1.jpg", price: 3200 },
  { id: 4, name: "White Shirt", image: "/shirt1.jpg", price: 1200 },
  { id: 5, name: "Handbag", image: "/bag1.jpg", price: 2200 },
];

export default function ShopNestCartBudget() {
  const [budget, setBudget] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [cart, setCart] = useState<typeof sampleProducts>([]);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const navigate = useNavigate();

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(budgetInput);
    if (value > 0) {
      setBudget(value);
      setRemaining(value);
      setShowBudgetInput(false);
      setCart([]);
    }
  };

  const handleAddToCart = (product: typeof sampleProducts[0]) => {
    if (remaining >= product.price) {
      setCart([...cart, product]);
      setRemaining(remaining - product.price);
    }
  };

  const percent = budget ? Math.max(0, (remaining / budget) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl">
        {/* Budget Management Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#0071ce] font-bold text-lg">Budget Management</div>
          <button
            className="bg-[#ffc220] text-white font-bold px-4 py-2 rounded shadow hover:bg-yellow-400 transition"
            onClick={() => setShowBudgetInput(true)}
          >
            Manage Budget
          </button>
        </div>
        {/* Budget Input Modal/Area */}
        {showBudgetInput && (
          <form
            onSubmit={handleSetBudget}
            className="mb-8 flex flex-col items-center bg-white rounded-xl shadow-lg p-6 border border-[#ffc220]"
          >
            <label className="text-lg font-semibold mb-2 text-[#0071ce]">Set your shopping budget (₹):</label>
            <input
              type="number"
              min={1}
              className="border rounded px-4 py-2 mb-2 w-64 text-center"
              value={budgetInput}
              onChange={e => setBudgetInput(e.target.value)}
              required
              placeholder="e.g. 10000"
            />
            <span className="text-gray-500 text-sm mb-4">Enter your total shopping budget in rupees. Example: 10000</span>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-[#ffc220] text-white font-bold px-6 py-2 rounded shadow hover:bg-yellow-400 transition"
              >
                Set Budget
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 font-bold px-6 py-2 rounded shadow hover:bg-gray-300 transition"
                onClick={() => setShowBudgetInput(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* Budget Tracker Bar */}
        {budget !== null && !showBudgetInput && (
          <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg p-4 shadow-lg flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="w-full bg-gray-200 rounded-full h-6 relative">
              <div
                className="h-6 rounded-full transition-all absolute left-0 top-0"
                style={{
                  width: `${percent}%`,
                  background: "#ffc220",
                }}
              />
              <div className="absolute w-full h-6 flex items-center justify-center text-[#0071ce] font-bold text-sm">
                {percent > 0 ? `${percent.toFixed(0)}% left` : "Budget exhausted"}
              </div>
            </div>
            <button
              className="mt-4 md:mt-0 bg-[#005DAA] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#004b91] transition"
              onClick={() => navigate('/shopnestbudget')}
            >
              Click Me
            </button>
          </div>
        )}
        {/* Product Cards */}
        {budget !== null && !showBudgetInput && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sampleProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-2xl transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded mb-3"
                />
                <div className="font-semibold text-lg mb-1">{product.name}</div>
                <div className="text-[#0071ce] font-bold mb-3">₹{product.price.toLocaleString()}</div>
                <button
                  className={`w-full px-4 py-2 rounded-full font-bold transition ${
                    product.price > remaining
                      ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-[#ffc220] text-white hover:bg-yellow-400"
                  }`}
                  disabled={product.price > remaining}
                  onClick={() => handleAddToCart(product)}
                >
                  {product.price > remaining ? "Over Budget" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 