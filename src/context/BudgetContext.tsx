import React, { createContext, useContext, useState } from "react";

interface BudgetContextType {
  budget: number;
  remaining: number;
  setBudget: (amount: number) => void;
  spend: (amount: number) => void;
  reset: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [budget, setBudgetState] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  const setBudget = (amount: number) => {
    setBudgetState(amount);
    setRemaining(amount);
  };

  const spend = (amount: number) => {
    setRemaining((prev) => Math.max(0, prev - amount));
  };

  const reset = () => {
    setBudgetState(0);
    setRemaining(0);
  };

  return (
    <BudgetContext.Provider
      value={{ budget, remaining, setBudget, spend, reset }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
