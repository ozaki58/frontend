// frontend/pages/match/[userId].js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import io from "socket.io-client";

  const socket = io("http://localhost:5000/match", {
    // WARNING: in that case, there is no fallback to long-polling
    transports: [ 'websocket', 'polling' ]
  });
  


export default function Match() {
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    
    
    socket.on('match', (matchedUserId) => {
      if (matchedUserId === userId) {
        router.push(`/chat/${userId}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div>
      <h1>Waiting for a match...</h1>
    </div>
  );
}