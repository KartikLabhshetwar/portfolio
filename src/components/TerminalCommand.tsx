import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TerminalCommand: React.FC = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim().toLowerCase() === 'npx kartikdev') {
      setOutput('Running kartikdev...\n\nHello! I\'m Kartik Labhshetwar, a full-stack developer passionate about creating efficient web applications. Feel free to explore my portfolio!');
    } else {
      setOutput(`Command not found: ${command}`);
    }
    setCommand('');
  };

  return (
    <motion.div
      className="bg-gray-900 text-green-400 p-4 rounded-lg shadow-lg font-mono"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleCommand}>
        <div className="flex items-center">
          <span className="mr-2">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="bg-transparent outline-none flex-grow"
            placeholder="Type 'npx kartikdev' and press Enter"
          />
        </div>
      </form>
      {output && (
        <pre className="mt-2 whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </motion.div>
  );
};

export default TerminalCommand;
