import "./App.css";
import { Menu } from './components/Menu';
import { Content } from './components/Content';
import { useState } from 'react';


function App() {
  const [contentID, setContentID] = useState(crypto.randomUUID());

  const handleReload = () => {
    setContentID(crypto.randomUUID());
  }
  return (
    <main className="container">
      <Content key={contentID} onReload={handleReload} />
      <Menu onReload={handleReload} />
    </main>
  );
}

export default App;
