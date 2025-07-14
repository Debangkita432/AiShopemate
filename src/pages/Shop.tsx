
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import BudgetTracker from '../components/BudgetTracker';
import { useCart } from '../components/CartContext';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    products: [
      { id: 1, name: 'MacBook Pro', price: '$1,299', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400', rating: 4.8 },
      { id: 2, name: 'Gaming Laptop', price: '$999', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400', rating: 4.6 },
      { id: 3, name: 'Circuit Board Kit', price: '$79', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', rating: 4.3 },
      { id: 4, name: 'Coding Monitor', price: '$399', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', rating: 4.7 },
      { id: 5, name: 'Wireless Headphones', price: '$249', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400', rating: 4.5 },
      { id: 6, name: 'Smart Watch', price: '$299', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', rating: 4.4 },
      { id: 7, name: 'Tablet Pro', price: '$599', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400', rating: 4.6 },
      { id: 8, name: 'AI Robot Assistant', price: '$1,999', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400', rating: 4.9 },
      { id: 9, name: 'Gaming Console', price: '$499', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', rating: 4.8 },
      { id: 10, name: 'Web Development Setup', price: '$1,299', image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400', rating: 4.7 },
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    products: [
      { id: 11, name: 'Designer Jacket', price: '$199', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', rating: 4.5 },
      { id: 12, name: 'Casual Sneakers', price: '$129', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', rating: 4.6 },
      { id: 13, name: 'Summer Dress', price: '$89', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', rating: 4.4 },
      { id: 14, name: 'Business Suit', price: '$399', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', rating: 4.7 },
      { id: 15, name: 'Winter Coat', price: '$249', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', rating: 4.5 },
      { id: 16, name: 'Designer Handbag', price: '$329', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', rating: 4.8 },
      { id: 17, name: 'Sports Wear Set', price: '$79', image: 'https://images.unsplash.com/photo-1506629905607-74dc443ab81a?w=400', rating: 4.3 },
      { id: 18, name: 'Formal Shoes', price: '$179', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', rating: 4.6 },
      { id: 19, name: 'Vintage Jeans', price: '$119', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', rating: 4.4 },
      { id: 20, name: 'Luxury Watch', price: '$899', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', rating: 4.9 },
    ]
  },
  {
    id: 'home',
    name: 'Home & Garden',
    products: [
      { id: 21, name: 'Smart Thermostat', price: '$199', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', rating: 4.6 },
      { id: 22, name: 'Indoor Plant Set', price: '$49', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', rating: 4.5 },
      { id: 23, name: 'Coffee Maker', price: '$149', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', rating: 4.7 },
      { id: 24, name: 'Dining Table Set', price: '$599', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', rating: 4.4 },
      { id: 25, name: 'Bedroom Lamp', price: '$79', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', rating: 4.3 },
      { id: 26, name: 'Kitchen Appliance Set', price: '$399', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', rating: 4.8 },
      { id: 27, name: 'Garden Tools', price: '$89', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', rating: 4.2 },
      { id: 28, name: 'Sofa Set', price: '$899', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', rating: 4.6 },
      { id: 29, name: 'Wall Art Collection', price: '$129', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400', rating: 4.4 },
      { id: 30, name: 'Smart Security System', price: '$299', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', rating: 4.7 },
    ]
  }
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('electronics');
  const [favorites, setFavorites] = useState<number[]>([]);
  const { addToCart, getTotal } = useCart();
  const { userProfile } = useAuth();
  const budget = userProfile?.budget || 0;
  const spent = getTotal();

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const canAddToCart = (price: number) => spent + price <= budget;

  return (
    <div className="min-h-screen bg-dark-gradient pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <BudgetTracker />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-white bg-clip-text text-transparent">
            AI-Powered Shopping
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover products tailored to your preferences
          </p>
        </motion.div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-morphism mb-8">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.products.map((product, index) => {
                  const price = Number(product.price.replace(/[^\d.]/g, ''));
                  const disabled = !canAddToCart(price);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-morphism hover:shadow-lg cursor-pointer h-full">
                        <CardHeader className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Heart 
                                className={`w-4 h-4 ${
                                  favorites.includes(product.id) 
                                    ? 'fill-red-500 text-red-500' 
                                    : 'text-muted-foreground'
                                }`} 
                              />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-lg mb-2 text-foreground">
                            {product.name}
                          </CardTitle>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">
                                {product.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-white">
                              {product.price}
                            </span>
                            <Button
                              className="bg-white text-black hover:shadow-lg"
                              disabled={disabled}
                              onClick={() => {
                                if (disabled) {
                                  toast.error('Adding this item would exceed your budget!');
                                } else {
                                  addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price,
                                    image: product.image,
                                  });
                                  toast.success('Added to cart!');
                                }
                              }}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {disabled ? 'Over Budget' : 'Add to Cart'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
