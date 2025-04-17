// 'use client';

// import { useEffect, useState, FormEvent } from 'react';
// import io, { Socket } from 'socket.io-client';

// type ChatMessage = {
//   user: string;
//   message: string;
// };

// let socket: Socket;

// export default function Home() {
//   const [username, setUsername] = useState('');
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [joined, setJoined] = useState(false);

//   useEffect(() => {
//     fetch('/api/socket');
//     socket = io();

//     socket.on('message', (data: ChatMessage) => {
//       setChat((prev) => [...prev, data]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleJoin = (e: FormEvent) => {
//     e.preventDefault();
//     if (username.trim()) {
//       setJoined(true);
//     }
//   };

//   const sendMessage = (e: FormEvent) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     const data: ChatMessage = { user: username, message };
//     socket.emit('message', data);
//     setChat((prev) => [...prev, data]);
//     setMessage('');
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       {!joined ? (
//         <form onSubmit={handleJoin} className="flex flex-col gap-2">
//           <h1 className="text-xl font-bold">Enter your name to chat</h1>
//           <input
//             className="border p-2"
//             placeholder="Your name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <button className="bg-blue-500 text-white p-2 rounded" type="submit">
//             Join
//           </button>
//         </form>
//       ) : (
//         <>
//           <h1 className="text-xl font-bold mb-2">Chatting as {username}</h1>
//           <div className="border p-4 h-64 overflow-y-auto mb-4 bg-gray-50 rounded">
//             {chat.map((msg, i) => (
//               <div key={i}>
//                 <strong>{msg.user}:</strong> {msg.message}
//               </div>
//             ))}
//           </div>
//           <form onSubmit={sendMessage} className="flex gap-2">
//             <input
//               className="border p-2 flex-1"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type a message"
//             />
//             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//               Send
//             </button>
//           </form>
//         </>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState, FormEvent } from 'react';
import io, { Socket } from 'socket.io-client';

type ChatMessage = {
  user: string;
  message: string;
};

let socket: Socket;

export default function Home() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetch('/api/socket');
    socket = io();

    socket.on('message', (data: ChatMessage) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
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
    socket.emit('message', data);
    setChat((prev) => [...prev, data]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {!joined ? (
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">Join the Chat</h1>
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
                      className={`px-4 py-2 rounded-lg max-w-[70%] ${
                        isMe
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
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                className="border p-2 flex-1 rounded"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
