import React, { useState } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages((prev) => [...prev, `🧑: ${input}`]);

    if (input.toLowerCase().includes("budget")) {
      const num = parseInt(input.replace(/\D/g, ""));
      if (!isNaN(num)) {
        setMessages((prev) => [...prev, `🤖: Budget set to ₹${num}`]);
      } else {
        setMessages((prev) => [...prev, `🤖: Please enter a valid budget`]);
      }
    } else {
      setMessages((prev) => [...prev, `🤖: I heard you say: "${input}"`]);
    }

    setInput("");
  };

  return (
    <div className="bg-gray-900 p-4 rounded text-white">
      <div className="bg-gray-100 text-black p-2 rounded h-64 overflow-y-scroll mb-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            Start a conversation...
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="my-1">
              {msg}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="border p-2 rounded w-full text-black"
          placeholder="Ask me about budget or products..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
