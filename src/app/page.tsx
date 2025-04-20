'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import io, { Socket } from 'socket.io-client';

type ChatMessage = {
  user: string;
  message: string;
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [joined, setJoined] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    fetch('/api/socket');
    socket.current = io();

    socket.current.on('message', (data: ChatMessage) => {
      setChat((prev) => [...prev, data]);
    });

    socket.current.on('typing', (name: string) => {
      setTypingUser(name);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setTypingUser(null);
      }, 2000); // Hide after 2s
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setJoined(true);
    }
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const data: ChatMessage = { user: username, message };
    socket.current?.emit('message', data);
    setChat((prev) => [...prev, data]);
    setMessage('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (socket.current && username.trim()) {
      socket.current.emit('typing', username);  // Emit typing only if username is valid
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {!joined ? (
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center text-black">Join the Chat</h1>
            <input
              className="border p-2 rounded"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              type="submit"
            >
              Join Chat
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Chatting as <span className="text-blue-600">{username}</span>
            </h2>
            <div className="h-64 overflow-y-auto space-y-2 mb-4 bg-gray-50 p-3 rounded">
              {chat.map((msg, i) => {
                const isMe = msg.user === username;
                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[70%] ${isMe
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                    >
                      {!isMe && <div className="text-xs text-gray-500 mb-1">{msg.user}</div>}
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
            {typingUser && typingUser !== username && (
              <div className="text-sm text-gray-500 italic mb-2">
                {typingUser} is typing...
              </div>
            )}
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                className="border p-2 flex-1 rounded"
                value={message}
                onChange={handleTyping}  // Use the updated typing handler
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
