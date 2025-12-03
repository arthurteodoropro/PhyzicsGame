import { useState, useEffect, useRef } from 'react';
import './Playground.css';
import Modal from './Modal';

export default function Playground({ onNavigate }) {
  const canvasRef = useRef(null);
  const [selectedConcept, setSelectedConcept] = useState('projectile');
  const [isPlaying, setIsPlaying] = useState(false);
  const [code, setCode] = useState(getDefaultCode('projectile'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasShownModalForCurrentError, setHasShownModalForCurrentError] = useState(false);
  const animationRef = useRef(null);
  const simulationRef = useRef(null);

  const concepts = [
    { id: 'projectile', name: 'Lançamento de Projétil', icon: '🎯' },
    { id: 'collision', name: 'Colisão', icon: '💥' },
    { id: 'friction', name: 'Atrito', icon: '📦' },
    { id: 'pendulum', name: 'Pêndulo', icon: '⚖️' }
  ];

  function getDefaultCode(concept) {
    const codes = {
      projectile: `// Lançamento de Projétil
const params = {
  velocidadeInicial: 20,
  angulo: 45,
  gravidade: 9.8,
  massa: 1.0
};

function simularProjetil(ctx, canvas, p) {
  const anguloRad = (p.angulo * Math.PI) / 180;
  const vx = p.velocidadeInicial * Math.cos(anguloRad);
  const vy = -p.velocidadeInicial * Math.sin(anguloRad);
  
  // x(t) = x0 + vx * t
  // y(t) = y0 + vy * t + (1/2) * g * t²
}`,
      collision: `// Colisão Elástica
const params = {
  massa1: 2.0,
  massa2: 1.0,
  velocidade1: 10,
  velocidade2: -8,
  coeficienteRestituicao: 0.9
};

function simularColisao(m1, m2, v1, v2, e) {
  const v1Final = (m1*v1 + m2*v2 + m2*e*(v2-v1)) / (m1+m2);
  const v2Final = (m1*v1 + m2*v2 + m1*e*(v1-v2)) / (m1+m2);
  return { v1Final, v2Final };
}`,
      friction: `// Atrito e Deslizamento
const params = {
  massa: 5.0,
  forcaAplicada: 25,
  coeficienteAtrito: 0.3,
  gravidade: 9.8
};

function simularAtrito(m, F, μ, g) {
  const N = m * g;
  const Fat = μ * N;
  const Fres = F - Fat;
  const a = Fres / m;
}`,
      pendulum: `// Pêndulo Simples
const params = {
  comprimento: 150,
  anguloInicial: 30,
  massa: 2.0,
  gravidade: 9.8
};

function simularPendulo(L, θ, m, g) {
  const α = -(g / L) * Math.sin(θ);
  // ω(t+Δt) = ω(t) + α*Δt
  // θ(t+Δt) = θ(t) + ω*Δt
}`
    };
    return codes[concept] || codes.projectile;
  }

  useEffect(() => {
    setCode(getDefaultCode(selectedConcept));
    setIsPlaying(false);
    setErrorMessage('');
    setHasShownModalForCurrentError(false);
  }, [selectedConcept]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const simulate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGrid(ctx, canvas.width, canvas.height);

      if (!isPlaying) {
        drawInitialState(ctx, canvas.width, canvas.height, selectedConcept);
        return;
      }

      try {
        const paramsMatch = code.match(/const params = \{[\s\S]*?\};/);
        if (!paramsMatch) {
          throw new Error('Parâmetros não encontrados');
        }
        
        const getParams = new Function(paramsMatch[0] + '; return params;');
        const params = getParams();
        
        validateCode(code, selectedConcept);
        
        switch(selectedConcept) {
          case 'projectile':
            simulateProjectile(ctx, canvas, params);
            break;
          case 'collision':
            simulateCollision(ctx, canvas, params);
            break;
          case 'friction':
            simulateFriction(ctx, canvas, params);
            break;
          case 'pendulum':
            simulatePendulum(ctx, canvas, params);
            break;
        }
        
        if (errorMessage) {
          setErrorMessage('');
          setHasShownModalForCurrentError(false);
        }
      } catch (e) {
        ctx.fillStyle = '#ff4444';
        ctx.font = '16px monospace';
        ctx.fillText('Erro no código: ' + e.message, 20, 30);
        
        const newErrorMsg = '⚠️ ' + e.message;
        
        if (e.message.includes('código protegido') && !hasShownModalForCurrentError) {
          setShowModal(true);
          setHasShownModalForCurrentError(true);
        }
        
        setErrorMessage(newErrorMsg);
      }

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, code, selectedConcept, errorMessage, hasShownModalForCurrentError]);

  function validateCode(userCode, concept) {
    const originalCode = getDefaultCode(concept);
    
    const userFunctionPart = userCode.split('function ')[1];
    const originalFunctionPart = originalCode.split('function ')[1];
    
    if (userFunctionPart && originalFunctionPart) {
      const userClean = userFunctionPart.replace(/\s+/g, '');
      const originalClean = originalFunctionPart.replace(/\s+/g, '');
      
      if (userClean !== originalClean) {
        throw new Error('Você modificou código protegido! Altere apenas os valores dentro de "params".');
      }
    }
  }

  function drawGrid(ctx, width, height) {
    ctx.strokeStyle = '#2a2a4a';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function drawInitialState(ctx, width, height, concept) {
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    
    const messages = {
      projectile: '▶️ Clique em PLAY para lançar o projétil',
      collision: '▶️ Clique em PLAY para ver a colisão',
      friction: '▶️ Clique em PLAY para aplicar força',
      pendulum: '▶️ Clique em PLAY para soltar o pêndulo'
    };
    
    ctx.fillText(messages[concept], width / 2, height / 2);
  }

  function simulateProjectile(ctx, canvas, params) {
    if (!simulationRef.current) {
      const angleRad = (params.angulo * Math.PI) / 180;
      simulationRef.current = {
        x: 50,
        y: canvas.height - 50,
        vx: params.velocidadeInicial * Math.cos(angleRad),
        vy: -params.velocidadeInicial * Math.sin(angleRad),
        time: 0
      };
    }

    const sim = simulationRef.current;
    const dt = 0.025;
    
    sim.vy += params.gravidade * dt;
    sim.x += sim.vx * dt * 15;
    sim.y += sim.vy * dt * 15;
    sim.time += dt;

    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const steps = 100;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * 2.5;
      const angleRad = (params.angulo * Math.PI) / 180;
      const x = 50 + params.velocidadeInicial * Math.cos(angleRad) * t * 15;
      const y = canvas.height - 50 - (params.velocidadeInicial * Math.sin(angleRad) * t - 0.5 * params.gravidade * t * t) * 15;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(sim.x, sim.y, 15, 0, Math.PI * 2);
    ctx.fill();

    drawVector(ctx, sim.x, sim.y, sim.vx * 2, 0, '#4ecdc4', 'Vx');
    drawVector(ctx, sim.x, sim.y, 0, sim.vy * 2, '#ffe66d', 'Vy');

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Tempo: ${sim.time.toFixed(1)}s`, 15, 25);
    ctx.fillText(`Velocidade X: ${sim.vx.toFixed(1)} m/s`, 15, 50);
    ctx.fillText(`Velocidade Y: ${sim.vy.toFixed(1)} m/s`, 15, 75);
    ctx.fillText(`Altura: ${((canvas.height - sim.y) / 15).toFixed(1)} m`, 15, 100);

    if (sim.y > canvas.height - 50) {
      simulationRef.current = null;
    }
  }

  function simulateCollision(ctx, canvas, params) {
    if (!simulationRef.current) {
      simulationRef.current = {
        x1: 150,
        x2: canvas.width - 150,
        v1: params.velocidade1,
        v2: params.velocidade2,
        collided: false
      };
    }

    const sim = simulationRef.current;
    const y = canvas.height / 2;

    if (!sim.collided) {
      sim.x1 += sim.v1 * 0.3;
      sim.x2 += sim.v2 * 0.3;

      if (Math.abs(sim.x1 - sim.x2) < 50) {
        const m1 = params.massa1;
        const m2 = params.massa2;
        const e = params.coeficienteRestituicao;
        
        const v1Final = (m1 * sim.v1 + m2 * sim.v2 + m2 * e * (sim.v2 - sim.v1)) / (m1 + m2);
        const v2Final = (m1 * sim.v1 + m2 * sim.v2 + m1 * e * (sim.v1 - sim.v2)) / (m1 + m2);
        
        sim.v1 = v1Final;
        sim.v2 = v2Final;
        sim.collided = true;
      }
    } else {
      sim.x1 += sim.v1 * 0.3;
      sim.x2 += sim.v2 * 0.3;
    }

    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(sim.x1, y, 20 + params.massa1 * 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.arc(sim.x2, y, 20 + params.massa2 * 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Bola 1 - v: ${sim.v1.toFixed(1)} m/s | m: ${params.massa1} kg`, 15, 25);
    ctx.fillText(`Bola 2 - v: ${sim.v2.toFixed(1)} m/s | m: ${params.massa2} kg`, 15, 50);
    ctx.fillText(`Status: ${sim.collided ? 'Após colisão' : 'Antes da colisão'}`, 15, 75);

    if (sim.x1 > canvas.width + 100 || sim.x2 < -100 || sim.x1 < -100 || sim.x2 > canvas.width + 100) {
      simulationRef.current = null;
    }
  }

  function simulateFriction(ctx, canvas, params) {
    if (!simulationRef.current) {
      simulationRef.current = {
        x: 100,
        v: 0,
        a: 0
      };
    }

    const sim = simulationRef.current;
    const y = canvas.height - 100;
    
    const forcaNormal = params.massa * params.gravidade;
    const forcaAtrito = params.coeficienteAtrito * forcaNormal;
    const forcaResultante = params.forcaAplicada - forcaAtrito;
    
    sim.a = forcaResultante / params.massa;
    sim.v += sim.a * 0.025;
    sim.x += sim.v * 0.8;

    ctx.fillStyle = '#555';
    ctx.fillRect(0, y + 40, canvas.width, 10);

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(sim.x - 25, y, 50, 40);

    drawVector(ctx, sim.x, y + 20, params.forcaAplicada * 2, 0, '#00ff88', 'F');
    drawVector(ctx, sim.x, y + 20, -forcaAtrito * 2, 0, '#ff4444', 'Fat');

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Força Aplicada: ${params.forcaAplicada.toFixed(1)} N`, 15, 25);
    ctx.fillText(`Força de Atrito: ${forcaAtrito.toFixed(1)} N`, 15, 50);
    ctx.fillText(`Aceleração: ${sim.a.toFixed(1)} m/s²`, 15, 75);
    ctx.fillText(`Velocidade: ${sim.v.toFixed(1)} m/s`, 15, 100);

    if (sim.x > canvas.width + 50) {
      simulationRef.current = null;
    }
  }

  function simulatePendulum(ctx, canvas, params) {
    if (!simulationRef.current) {
      simulationRef.current = {
        angle: (params.anguloInicial * Math.PI) / 180,
        angularVel: 0,
        time: 0
      };
    }

    const sim = simulationRef.current;
    const centerX = canvas.width / 2;
    const centerY = 100;
    
    const angularAcc = -(params.gravidade / params.comprimento) * Math.sin(sim.angle);
    sim.angularVel += angularAcc * 0.025;
    sim.angle += sim.angularVel * 0.025;
    sim.time += 0.025;

    const bobX = centerX + params.comprimento * Math.sin(sim.angle);
    const bobY = centerY + params.comprimento * Math.cos(sim.angle);

    ctx.fillStyle = '#666';
    ctx.fillRect(centerX - 30, centerY - 10, 60, 10);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15 + params.massa * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Ângulo: ${(sim.angle * 180 / Math.PI).toFixed(1)}°`, 15, 25);
    ctx.fillText(`Vel. Angular: ${sim.angularVel.toFixed(2)} rad/s`, 15, 50);
    ctx.fillText(`Tempo: ${sim.time.toFixed(1)}s`, 15, 75);
    ctx.fillText(`Comprimento: ${params.comprimento} px`, 15, 100);
  }

  function drawVector(ctx, x, y, dx, dy, color, label) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();

    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - 10 * Math.cos(angle - Math.PI / 6), y + dy - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x + dx - 10 * Math.cos(angle + Math.PI / 6), y + dy - 10 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 12px monospace';
    ctx.fillText(label, x + dx + 10, y + dy - 5);
  }

  const handlePlay = () => {
    simulationRef.current = null;
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    simulationRef.current = null;
  };

  const handleResetCode = () => {
    setCode(getDefaultCode(selectedConcept));
    setErrorMessage('');
    setHasShownModalForCurrentError(false);
    setIsPlaying(false);
    simulationRef.current = null;
  };

  return (
    <div className="playground-container">
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        errorCount={1}
      />
      
      <aside className={`playground-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? 'Recolher menu' : 'Expandir menu'}
        >
          <span></span>
        </button>
        
        {isSidebarOpen && (
          <>
            <div className="sidebar-header">
              <h2>Conceitos</h2>
            </div>
            <nav className="concepts-menu">
              {concepts.map(concept => (
                <button
                  key={concept.id}
                  className={`concept-button ${selectedConcept === concept.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedConcept(concept.id);
                    handleReset();
                  }}
                >
                  <span className="concept-icon">{concept.icon}</span>
                  <span className="concept-name">{concept.name}</span>
                </button>
              ))}
            </nav>
          </>
        )}
      </aside>

      <main className="playground-main">
        <div className="simulation-panel">
          <div className="panel-header">
            <h3>Simulação</h3>
            <div className="controls">
              <button className="control-btn play-btn" onClick={handlePlay}>
                {isPlaying ? '⏸️ Pausar' : '▶️ Play'}
              </button>
              <button className="control-btn reset-btn" onClick={handleReset}>
                🔄 Reset
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="simulation-canvas"></canvas>
        </div>

        <div className="code-panel">
          <div className="panel-header">
            <h3>Código da Simulação</h3>
            <div className="controls">
              {errorMessage && (
                <span className="error-badge">{errorMessage}</span>
              )}
              <button 
                className="control-btn reset-btn" 
                onClick={handleResetCode}
                title="Restaurar código original"
              >
                🔄 Resetar Código
              </button>
            </div>
          </div>
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </div>
      </main>
    </div>
  );
}