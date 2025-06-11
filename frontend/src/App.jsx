import React, { useEffect, useState } from 'react';
import './index.css';

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    window.Telegram?.WebApp.ready();
    setReady(true);
  }, []);
  if (!ready) return <div>Загрузка...</div>;
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold">Caffè Italiano</h1>
      <p>WebApp работает и готов к заказам!</p>
    </div>
  );
}
