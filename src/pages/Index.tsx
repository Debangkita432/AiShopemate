import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AIAvatar } from '../components/AIAvatar';
import { generateAIResponse, shopingAssistantContext } from '../lib/gemini';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Footer } from '../components/footer';

const Index = () => {
  const { user, userProfile } = useAuth();
  const [aiMessage, setAiMessage] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);

  const features = [
    { title: "AI Avatar Assistant", description: "Interactive 3D AI that guides your shopping journey" },
    { title: "Smart Recommendations", description: "Personalized product suggestions based on your preferences" },
    { title: "Budget Management", description: "Keep track of your spending with real-time budget updates" },
    { title: "Virtual Try-On", description: "See how products look on you before buying" },
    { title: "Voice Shopping", description: "Shop hands-free with voice commands and AI chat" },
    { title: "Smart Search", description: "Find exactly what you need with AI-powered search" }
  ];

  useEffect(() => {
    const generateWelcomeMessage = async () => {
      setIsAiSpeaking(true);
      try {
        const greeting = user && userProfile 
          ? `Welcome back ${userProfile.name}! Ready to continue your shopping journey?`
          : "Welcome to AIShopmate! I'm your AI shopping assistant. Ready to revolutionize your shopping experience?";

        const response = await generateAIResponse(greeting, shopingAssistantContext);
        setAiMessage(response);
      } catch (error) {
        setAiMessage("Welcome to AIShopmate! I'm your AI shopping assistant ready to help you shop smarter!");
      } finally {
        setTimeout(() => {
          setIsAiSpeaking(false);
          setLoading(false);
        }, 2000);
      }
    };
    generateWelcomeMessage();
  }, [user, userProfile]);

  const handleVoiceInput = async (text: string) => {
    setIsAiSpeaking(true);
    try {
      const response = await generateAIResponse(
        `User said: "${text}". Respond helpfully as a shopping assistant.`,
        shopingAssistantContext
      );
      setAiMessage(response);
    } catch {
      setAiMessage("I heard you! How can I help you with your shopping today?");
    } finally {
      setTimeout(() => setIsAiSpeaking(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <img src="/Logo.png" alt="AIShopmate Logo" className="w-24 h-24 animate-bounce" />
          <p className="mt-4 text-lg font-semibold text-[#005DAA] animate-pulse">Getting your smart shopping experience ready...</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-6xl font-bold leading-tight text-[#005DAA]">
                  Smart Shopping
                  <br />
                  <span className="text-[#FFC220]">Made Simple</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Experience the future of e-commerce with our AI avatar assistant. 
                  Get personalized recommendations, manage your budget, and shop smarter than ever before.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  userProfile ? (
                    <Link to="/shop">
                      <Button className="text-white text-lg px-8 py-6" style={{ background: 'linear-gradient(to right, #005DAA, #003F73)' }}>
                        Continue Shopping
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/onboarding">
                      <Button className="text-white text-lg px-8 py-6" style={{ background: 'linear-gradient(to right, #005DAA, #003F73)' }}>
                        Complete Profile
                      </Button>
                    </Link>
                  )
                ) : (
                  <>
                    <Link to="/signup">
                      <Button className="text-white text-lg px-8 py-6" style={{ background: 'linear-gradient(to right, #005DAA, #003F73)' }}>
                        Get Started Free
                      </Button>
                    </Link>
                    <Link to="/signin">
                      <Button variant="outline" className="border-[#005DAA] text-[#005DAA] text-lg px-8 py-6">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* User Info */}
              {userProfile && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Welcome back!</p>
                  <p className="text-lg font-semibold text-[#005DAA]">
                    Budget: ${userProfile.budget} | Preferences: {userProfile.preferences?.[0] || 'Not set'}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-100 p-6 rounded-2xl"
            >
              <AIAvatar
                isSpeaking={isAiSpeaking}
                message={aiMessage}
                onVoiceInput={handleVoiceInput}
              />
              {aiMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-white rounded-lg shadow-sm"
                >
                  <p className="text-center text-[#005DAA]">{aiMessage}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-[#005DAA]">Revolutionary Features</h2>
            <p className="text-xl text-[#FFC220] max-w-3xl mx-auto">
              Discover how AI transforms your shopping experience with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white border hover:shadow-xl hover:border-[#005DAA] transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-[#005DAA] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Bot Assistant (Matey) */}
      <div className="fixed bottom-8 right-6 md:bottom-10 md:right-10 z-50">
        <div className="relative group cursor-pointer">
          <img
            src="/chatbot.png"
            alt="Matey Bot"
            className="w-20 h-20 md:w-24 md:h-24 hover:scale-105 transition-transform"
          />
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-white text-[#005DAA] text-sm font-medium p-3 rounded-lg shadow-lg w-64">
            Hi I'm <span className="font-bold">Matey</span>, your shop guide. I'm here to help you with all your questions!
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
