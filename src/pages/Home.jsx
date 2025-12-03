import './Home.css';

export default function Home({ onNavigate }) {
  const handleStart = () => {
    onNavigate('welcome');
  };

  return (
    <div className="home-container">
      <div className="home-content">
  <div className="title-wrapper">
    <img 
      src="/src/assets/Titulo.svg" 
      alt="Física Interativa" 
      className="home-title"
    />
  </div>

  <button 
    className="home-start-button"
    onClick={handleStart}
    aria-label="Iniciar experiência"
  >
    <img 
      src="/src/assets/Botão.png" 
      alt="Iniciar" 
      className="home-button-image"
    />
  </button>
</div>

    </div>
  );
}