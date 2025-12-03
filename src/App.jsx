import { useState } from 'react';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Playground from './pages/Playground';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'welcome':
        return <Welcome onNavigate={setCurrentPage} />;
      case 'playground':
        return <Playground onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;