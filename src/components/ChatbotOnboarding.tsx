import React, { useState, useEffect, useRef } from 'react';

const allowedCategories = [
  'makeup', 'clothes', 'electronics', 'groceries', 'sports', 'books', 'home', 'beauty'
];

const questions = [
  "What's your name?",
  "What's your shopping budget today?",
  "What category are you interested in? (e.g., makeup, clothes)"
];

const ChatbotOnboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ name: '', budget: '', category: '' });
  const [input, setInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: questions[0] }
  ]);
  const [muted, setMuted] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const [categoryError, setCategoryError] = useState(false);

  // Speak the latest bot message
  useEffect(() => {
    if (muted) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.from === 'bot') {
      synthRef.current.cancel();
      const utter = new window.SpeechSynthesisUtterance(lastMsg.text);
      utter.lang = 'en-US';
      utter.rate = 1;
      utter.pitch = 1;
      synthRef.current.speak(utter);
    }
  }, [messages, muted]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    let newAnswers = { ...answers };
    if (step === 0) newAnswers.name = input;
    if (step === 1) newAnswers.budget = input;
    if (step === 2) {
      const cat = input.trim().toLowerCase();
      if (!allowedCategories.includes(cat)) {
        setMessages((msgs) => [
          ...msgs,
          { from: 'user', text: input },
          { from: 'bot', text: 'Sorry, the product currently does not exist.' }
        ]);
        setCategoryError(true);
        setInput('');
        return;
      } else {
        newAnswers.category = input;
        setCategoryError(false);
      }
    }
    setAnswers(newAnswers);
    if (step !== 2) {
      setMessages((msgs) => [
        ...msgs,
        { from: 'user', text: input }
      ]);
    }
    setInput('');
    if (step < 2) {
      setShowTyping(true);
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { from: 'bot', text: questions[step + 1] }
        ]);
        setShowTyping(false);
        setStep(step + 1);
      }, 900);
    } else if (!categoryError) {
      setMessages((msgs) => [
        ...msgs,
        { from: 'user', text: input }
      ]);
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-center text-[#0071ce] font-sans">Welcome to ShopNest</h2>
          <button
            onClick={() => setMuted((m) => !m)}
            className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold border transition ${muted ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-[#0071ce] text-white border-[#0071ce]'}`}
            aria-label={muted ? 'Unmute bot voice' : 'Mute bot voice'}
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
        <div className="flex flex-col space-y-2 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-base font-medium transition-all duration-300
                  ${msg.from === 'bot'
                    ? 'bg-white text-[#0071ce] border border-[#0071ce]'
                    : 'bg-[#ffc220] text-white'}
                `}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {showTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-[#0071ce] border border-[#0071ce] px-4 py-2 rounded-2xl font-medium animate-pulse">
                typing...
              </div>
            </div>
          )}
        </div>
        {step < 3 && !showTyping && (
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
              type={step === 1 ? 'number' : 'text'}
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071ce] text-base font-medium bg-gray-50"
              placeholder="Type your answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              min={step === 1 ? 1 : undefined}
            />
            <button
              type="submit"
              className="bg-[#0071ce] text-white px-5 py-2 rounded-2xl font-semibold hover:bg-[#005da0] transition"
            >
              Send
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="mt-6">
            <div className="bg-[#f4f8fb] rounded-xl p-5 shadow-inner">
              <h3 className="text-lg font-bold text-[#0071ce] mb-2">Summary</h3>
              <div className="space-y-1 text-gray-700 font-medium">
                <div><span className="text-[#0071ce]">Name:</span> {answers.name}</div>
                <div><span className="text-[#0071ce]">Budget:</span> ${answers.budget}</div>
                <div><span className="text-[#0071ce]">Category:</span> {answers.category}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotOnboarding; 