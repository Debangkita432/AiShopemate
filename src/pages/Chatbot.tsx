import React from "react";
import Chatbot from "../components/ChatBot";
import { useBudget } from "../context/BudgetContext";

const ChatbotPage = () => {
  const { budget, remaining, setBudget, spend, reset } = useBudget();

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">AI Chatbot + Budget Tracker</h2>

      <div className="mb-4">
        <p className="mb-2">
          💰 <strong>Budget:</strong> ₹{budget}
        </p>
        <p className="mb-2">
          📉 <strong>Remaining:</strong> ₹{remaining}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setBudget(10000)}
            className="bg-blue-600 px-3 py-1 rounded"
          >
            Set Budget to ₹10,000
          </button>
          <button
            onClick={() => spend(1500)}
            className="bg-green-600 px-3 py-1 rounded"
          >
            Spend ₹1500
          </button>
          <button onClick={reset} className="bg-red-600 px-3 py-1 rounded">
            Reset
          </button>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default ChatbotPage;
