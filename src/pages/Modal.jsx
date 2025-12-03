import { useEffect } from 'react';
import './Modal.css';

export default function Modal({ isOpen, onClose, errorCount }) {
  const tips = [
    {
      title: "Atenção: Área Protegida!",
      message: "Você está modificando o código protegido! Altere apenas os NÚMEROS dentro de 'params', na parte superior do código."
    },
    {
      title: "Cuidado: Código Protegido!",
      message: "Não mexa nas funções! Você só deve alterar os valores numéricos dentro do objeto 'params'. Todo o resto deve permanecer intacto."
    },
    {
      title: "Ops! Local Errado!",
      message: "Você está editando a parte errada do código. Foque apenas nos parâmetros no topo: velocidade, ângulo, massa, etc. Não altere as fórmulas!"
    },
    {
      title: "Zona Restrita!",
      message: "As funções de simulação não podem ser modificadas. Concentre-se apenas em ajustar os valores dentro de 'params' para experimentar diferentes resultados."
    },
    {
      title: "Área Bloqueada!",
      message: "Você tocou no código protegido! Lembre-se: altere APENAS os números dentro de 'params'. As equações físicas devem permanecer como estão."
    },
    {
      title: "Atenção ao Local!",
      message: "Modifique somente a seção de parâmetros! Os cálculos físicos abaixo não devem ser alterados, apenas os valores iniciais como massa, velocidade e ângulo."
    },
    {
      title: "Erro de Localização!",
      message: "Você está editando onde não deveria! Volte para o topo do código e altere apenas os números dentro de 'params'. É só isso que você precisa mudar!"
    },
    {
      title: "Só os Parâmetros!",
      message: "Fique na zona segura! Altere apenas os valores numéricos dentro de 'params'. Todo o código de simulação abaixo deve permanecer inalterado."
    }
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box">
          <img 
            src="/src/assets/Albert.png" 
            alt="Albert Frankenstein" 
            className="modal-character"
          />
          <div className="modal-content-wrapper">
            <button className="modal-close" onClick={onClose}>✕</button>
            
            <div className="modal-header">
              <h2>{randomTip.title}</h2>
            </div>
            
            <div className="modal-body">
              <p className="modal-message">{randomTip.message}</p>
            </div>

            <div className="modal-footer">
              <button className="modal-button" onClick={onClose}>
                Entendi!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}