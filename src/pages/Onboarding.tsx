
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AIAvatar } from '../components/AIAvatar';
import { generateAIResponse, shopingAssistantContext } from '../lib/gemini';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    contactNumber: '',
    budget: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const { updateProfile, userProfile } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Cosmetics', 'Fitness', 'Kitchen', 'Groceries', 'Clothing', 'Others'
  ];

  const handleNext = async () => {
    // Validate current step
    const currentField = ['age', 'gender', 'contactNumber', 'budget', 'category'][step - 1];
    const currentValue = formData[currentField as keyof typeof formData];
    
    if (!currentValue) {
      toast.error('Please fill in this field before continuing');
      return;
    }

    if (step < 5) {
      setStep(step + 1);
      generateAIGreeting(step + 1);
    } else {
      await handleSubmit();
    }
  };

  const generateAIGreeting = async (currentStep: number) => {
    setIsAiSpeaking(true);
    const stepMessages = {
      1: "Hello! I'm your AI shopping assistant. Let's get to know you better! What's your age?",
      2: "Great! Now, what's your gender? This helps me provide better recommendations.",
      3: "Perfect! Can you share your contact number for order updates?",
      4: "Awesome! What's your shopping budget? I'll help you find the best deals within your range.",
      5: "Excellent! What category would you like to shop for today?"
    };

    try {
      const response = await generateAIResponse(
        stepMessages[currentStep as keyof typeof stepMessages],
        shopingAssistantContext
      );
      setAiMessage(response);
    } catch (error) {
      console.log('AI response error:', error);
      setAiMessage(stepMessages[currentStep as keyof typeof stepMessages]);
    }
    
    setTimeout(() => setIsAiSpeaking(false), 2000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('Attempting to update profile with:', formData);
      
      await updateProfile({
        age: parseInt(formData.age),
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        budget: parseFloat(formData.budget),
        preferences: [formData.category]
      });
      
      toast.success('Profile completed! Welcome to AIShopmate!');
      navigate('/shop');
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'permission-denied' || error.message?.includes('insufficient permissions')) {
        toast.error('Unable to save profile due to database permissions. Continuing to shop...');
        // Still navigate to shop even if profile save fails
        navigate('/shop');
      } else {
        toast.error(error.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async (text: string) => {
    const currentField = ['age', 'gender', 'contactNumber', 'budget', 'category'][step - 1];
    setFormData(prev => ({ ...prev, [currentField]: text }));
    
    try {
      const response = await generateAIResponse(
        `User said: "${text}". Acknowledge this and encourage them to continue to the next step.`,
        shopingAssistantContext
      );
      setAiMessage(response);
    } catch (error) {
      console.log('Voice input AI response error:', error);
    }
  };

  React.useEffect(() => {
    generateAIGreeting(1);
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <label className="text-lg font-medium text-white">Enter your age:</label>
            <Input
              type="number"
              placeholder="25"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="glass-morphism border-white focus:border-white text-lg"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <label className="text-lg font-medium text-white">Select your gender:</label>
            <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger className="glass-morphism border-white focus:border-white text-lg">
                <SelectValue placeholder="Choose gender" />
              </SelectTrigger>
              <SelectContent className="glass-morphism">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <label className="text-lg font-medium text-white">Contact Number:</label>
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.contactNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
              className="glass-morphism border-white focus:border-white text-lg"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <label className="text-lg font-medium text-white">Shopping Budget ($):</label>
            <Input
              type="number"
              placeholder="500"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="glass-morphism border-white focus:border-white text-lg"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <label className="text-lg font-medium text-white">Select Category:</label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="glass-morphism border-white focus:border-white text-lg">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent className="glass-morphism">
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white bg-white bg-clip-text text-transparent mb-4">
            Let's Get Started!
          </h1>
          <p className="text-xl text-muted-foreground">
            Help me personalize your shopping experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* AI Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-6 rounded-2xl"
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
                className="mt-4 p-4 glass-morphism rounded-lg"
              >
                <p className="text-lg text-center text-white">{aiMessage}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-morphism border-white">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Step {step} of 5
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {userProfile?.name}, let's complete your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderStep()}
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="glass-morphism border-white hover:shadow-lg"
                  >
                    Previous
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={loading}
                    className="bg-white text-black font-semibold hover:shadow-lg"
                  >
                    {step === 5 ? (loading ? 'Completing...' : 'Complete Setup') : 'Next'}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <motion.div
                    className="bg-white h-2 rounded-full"
                    initial={{ width: '20%' }}
                    animate={{ width: `${(step / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
