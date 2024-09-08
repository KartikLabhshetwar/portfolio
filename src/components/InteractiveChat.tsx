import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes } from 'react-icons/fa';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const InteractiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage: Message = { text: inputMessage.trim(), sender: 'user' };
      setMessages([...messages, userMessage]);
      setInputMessage('');
      
      // Process the message and generate a response
      const botResponse = generateResponse(inputMessage.trim().toLowerCase());
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
      }, 500); // Simulate a slight delay for the bot's response
    }
  };

  const generateResponse = (message: string): string => {
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm Kartik's virtual assistant. How can I help you today?";
    } else if (message.includes('skills') || message.includes('technologies')) {
      return "Kartik is proficient in JavaScript, TypeScript, Java, Python, and C. He's experienced with React.js, Express.js, Node.js, MongoDB, PostgreSQL, and more. He also has knowledge of concepts like Compiler Design, Operating Systems, and Database Normalization.";
    } else if (message.includes('projects')) {
      return "Kartik has worked on several projects, including LearnX (a course selling platform), a Paytm clone, a Text-To-Speech application, and an EMI Calculator. You can find more details in the Projects section of his portfolio.";
    } else if (message.includes('contact') || message.includes('email')) {
      return "You can reach Kartik through the contact form on this website or connect with him on LinkedIn at linkedin.com/in/kartikcode.";
    } else if (message.includes('experience') || message.includes('work')) {
      return "Kartik is currently a student pursuing his B.Tech in Computer Science. He has hands-on experience with full-stack development through his projects and hackathon participation.";
    } else if (message.includes('education')) {
      return "Kartik is pursuing his Bachelor of Technology in Computer Science and Engineering at Government College of Engineering, Chh. Sambhajinagar, from November 2022 to July 2026.";
    } else if (message.includes('achievements') || message.includes('hackathon')) {
      return "Kartik secured 13th place in Quira's '006: Social Good' hackathon, competing against 50+ teams. He also developed a Gen AI application using React.js and Gemini API.";
    } else if (message.includes('github')) {
      return "You can find Kartik's GitHub profile at https://github.com/KartikLabhshetwar";
    } else if (message.includes('linkedin')) {
      return "You can connect with Kartik on LinkedIn at https://linkedin.com/in/kartikcode";
    } else if (message.includes('resume')) {
      return "You can view Kartik's resume by clicking the 'View Resume' button in the About section of his portfolio.";
    } else {
      return "I'm sorry, I didn't quite understand that. Can you please ask about Kartik's skills, projects, education, achievements, or contact information?";
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: "Hello! How can I help you learn more about Kartik?", sender: 'bot' }]);
    }
  }, [isOpen]);

  return (
    <>
      <motion.button
        className="fixed bottom-5 right-5 bg-primary text-text-light p-3 rounded-full shadow-lg"
        onClick={toggleChat}
        whileHover={{ scale: 1.1, backgroundColor: "#3B82F6" }}
        whileTap={{ scale: 0.9 }}
      >
        <FaComments size={24} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-5 w-80 bg-background rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="bg-primary text-text-light p-4 flex justify-between items-center">
              <h3 className="font-bold">Chat with Kartik's Assistant</h3>
              <button onClick={toggleChat}>
                <FaTimes />
              </button>
            </div>
            <div className="h-64 overflow-y-auto p-4 bg-background">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <p className={`p-2 rounded-lg inline-block ${msg.sender === 'user' ? 'bg-primary text-text-light' : 'bg-secondary text-text-light'}`}>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-text">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg bg-background text-text-light border-text focus:outline-none focus:border-primary"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InteractiveChat;
