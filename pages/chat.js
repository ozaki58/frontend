import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Chat() {
  const router = useRouter();
  const { userId, otherUserId } = router.query;

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userId && otherUserId) {
      // 自分のユーザーIDと相手のユーザーIDを使ってルームに参加
      socket.emit('join_chat', { userId, otherUserId });

      return () => {
        socket.emit('leave_chat', { userId, otherUserId });
      };
    }
  }, [userId, otherUserId]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = { senderId: userId, receiverId: otherUserId, message };
    socket.emit('send_message', newMessage);
    setMessages((messages) => [...messages, newMessage]);
    setMessage('');
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.senderId}: </strong>
            {message.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
