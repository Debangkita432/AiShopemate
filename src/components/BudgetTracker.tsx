import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from './CartContext';

const BudgetTracker: React.FC = () => {
  const { userProfile } = useAuth();
  const { getTotal } = useCart();

  const budget = userProfile?.budget || 0;
  const spent = getTotal();
  const remaining = Math.max(0, budget - spent);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg p-4 shadow-lg flex flex-col md:flex-row items-center justify-between mb-6">
      <div className="text-lg font-semibold text-white">
        <span>Total Budget: </span>
        <span className="font-bold">${budget.toFixed(2)}</span>
      </div>
      <div className="text-lg font-semibold text-white">
        <span>Spent: </span>
        <span className="font-bold">${spent.toFixed(2)}</span>
      </div>
      <div className="text-lg font-semibold text-white">
        <span>Remaining: </span>
        <span className={`font-bold ${remaining <= 0 ? 'text-red-300' : 'text-green-200'}`}>${remaining.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BudgetTracker; 