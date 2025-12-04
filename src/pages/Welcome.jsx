import './Welcome.css';

export default function Welcome({ onNavigate }) {
  const handleAdvance = () => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate('playground');
    } else {
      console.error('onNavigate não está definido ou não é uma função');
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-box">
          <img 
            src="/Albert.png" 
            alt="Albert Frankenstein" 
            className="welcome-character"
            onError={(e) => {
              console.error('Erro ao carregar imagem Albert.png');
              e.target.style.display = 'none';
            }}
          />
          <div className="welcome-text">
            <p>
              <strong>Olá, jovem cientista! Aqui é Albert Frankenstein, bem-vindo ao Phizics!</strong>
            </p>
            <p>
              Aqui você vai aprender como a Física funciona dentro do seu computador. Para jogar é simples: escolha um conceito físico no menu lateral, observe a simulação de um lado e edite o código do outro. Alterar valores como massa, velocidade ou ângulo modifica a experiência imediatamente, permitindo que você veja na prática como equações viram movimento. Experimente, teste e descubra, o laboratório é seu!
            </p>
          </div>
        </div>
        <button 
          className="welcome-advance-button"
          onClick={handleAdvance}
        >
          Avançar
        </button>
      </div>
    </div>
  );
}