import React, { useState } from 'react';
import BudgetTracker from '../components/BudgetTracker';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';

const BudgetTrackerPage: React.FC = () => {
  const { userProfile, updateProfile } = useAuth();
  const [budgetInput, setBudgetInput] = useState(userProfile?.budget?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const newBudget = parseFloat(budgetInput);
      if (!isNaN(newBudget) && newBudget > 0) {
        await updateProfile({ ...userProfile, budget: newBudget });
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-[#005DAA]">
        <h1 className="text-3xl font-bold text-center text-[#005DAA] mb-6">Budget Tracker</h1>
        <BudgetTracker />
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-4">
          <label className="text-lg font-semibold text-[#005DAA]">Set or Update Your Budget ($):</label>
          <input
            type="number"
            min={1}
            className="border rounded px-4 py-2 w-64 text-center"
            value={budgetInput}
            onChange={e => setBudgetInput(e.target.value)}
            required
            placeholder="e.g. 500"
          />
          <Button type="submit" className="bg-[#005DAA] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#004b91] transition" disabled={loading}>
            {loading ? 'Saving...' : 'Save Budget'}
          </Button>
          {success && <span className="text-green-600 font-medium">Budget updated!</span>}
        </form>
      </div>
    </div>
  );
};

export default BudgetTrackerPage; 