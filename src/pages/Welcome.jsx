import './Welcome.css';

export default function Welcome({ onNavigate }) {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-box">
          <img 
            src="/src/assets/Albert.png" 
            alt="Albert Frankenstein" 
            className="welcome-character"
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
          onClick={() => onNavigate('playground')}
        >
          Avançar
        </button>
      </div>
    </div>
  );
}