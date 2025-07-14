import React from 'react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../hooks/useAuth';
import BudgetTracker from '../components/BudgetTracker';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, getTotal } = useCart();
  const { userProfile } = useAuth();
  const budget = userProfile?.budget || 0;
  const spent = getTotal();
  const overBudget = spent > budget;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (overBudget) {
      toast.error('You are over budget! Remove some items.');
      return;
    }
    toast.success('Checkout successful! (Demo)');
    clearCart();
  };

  return (
    <div className="min-h-screen bg-white pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#005DAA]">Your Cart</h1>
        <BudgetTracker />
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-12">Your cart is empty.</div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <Card key={item.id} className="flex flex-col md:flex-row items-center p-4 shadow-md">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-6" />
                <CardContent className="flex-1">
                  <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                  <div className="text-lg font-semibold text-white mb-2">${item.price.toFixed(2)}</div>
                  <div className="text-gray-600 mb-2">Quantity: {item.quantity}</div>
                  <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-between items-center mt-8">
              <div className="text-2xl font-bold text-[#005DAA]">Total: ${spent.toFixed(2)}</div>
              <Button
                className="bg-white text-black hover:shadow-lg px-8 py-3 text-lg"
                disabled={cart.length === 0 || overBudget}
                onClick={handleCheckout}
              >
                {overBudget ? 'Over Budget' : 'Checkout'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 