
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Laptop, Shirt, Home } from 'lucide-react';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets, computers, and tech accessories',
    icon: Laptop,
    color: 'neon-blue',
    itemCount: 10,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
    featured: [
      'MacBook Pro',
      'Gaming Laptops',
      'Smart Devices',
      'AI Assistants'
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Trendy clothing, accessories, and footwear',
    icon: Shirt,
    color: 'neon-pink',
    itemCount: 10,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    featured: [
      'Designer Jackets',
      'Sneakers',
      'Luxury Watches',
      'Handbags'
    ]
  },
  {
    id: 'home',
    name: 'Home & Garden',
    description: 'Furniture, appliances, and home improvement',
    icon: Home,
    color: 'neon-green',
    itemCount: 10,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    featured: [
      'Smart Home',
      'Kitchen Appliances',
      'Garden Tools',
      'Furniture Sets'
    ]
  }
];

export default function Categories() {
  return (
    <div className="min-h-screen bg-dark-gradient pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-neon-gradient bg-clip-text text-transparent">
            Shop by Category
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our curated collections powered by AI recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-morphism hover-glow group cursor-pointer h-full overflow-hidden">
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className={`w-12 h-12 rounded-full bg-${category.color}/20 backdrop-blur-sm flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 text-${category.color}`} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-sm bg-black/50 px-2 py-1 rounded-full">
                        {category.itemCount} items
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl mb-2">
                      {category.name}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-foreground">Featured Items:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.featured.map((item) => (
                          <div
                            key={item}
                            className="text-sm text-muted-foreground bg-muted/20 px-3 py-2 rounded-lg"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Link to="/shop">
                      <Button className="w-full bg-neon-gradient text-black hover-glow group">
                        Explore Category
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground">
            More Categories Coming Soon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Sports & Fitness',
              'Books & Media',
              'Beauty & Health',
              'Automotive'
            ].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-morphism p-6 text-center hover-glow cursor-pointer"
              >
                <div className="w-12 h-12 bg-neon-gradient rounded-full mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium text-muted-foreground">
                  {category}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coming Soon
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
