// ============================================================
// STAR TREK SOLITAIRE — React Components
// Starfield, Card rendering, Victory cascade
// ============================================================

// Shared React hook destructuring (used by app.jsx too)
var { useState, useEffect, useRef, useCallback, memo } = React;

// ==================== STARFIELD ====================

function Starfield() {
  var ref = useRef(null);

  useEffect(function() {
    var canvas = ref.current;
    var ctx = canvas.getContext('2d');
    var animId = 0;

    var resize = function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    var stars = Array.from({ length: 140 }, function() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.03 + 0.005,
        phase: Math.random() * Math.PI * 2,
      };
    });

    var animate = function() {
      ctx.fillStyle = '#000008';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.phase += s.speed;
        s.x -= 0.03;
        s.y += 0.01;
        if (s.x < 0) s.x = canvas.width;
        if (s.y > canvas.height) s.y = 0;
        var alpha = s.brightness * (0.4 + 0.6 * ((Math.sin(s.phase) + 1) / 2));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,220,255,' + alpha + ')';
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return function() {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0" />;
}

// ==================== CARD COMPONENTS ====================

var CardFace = memo(function({ card, dim }) {
  var color = SUIT_COLORS[card.suit];
  var sym = SUIT_SYMBOLS[card.suit];
  var label = RANK_LABELS[card.rank];
  return (
    <div
      className={'relative bg-white rounded-sm select-none card-shadow' + (dim ? ' opacity-30' : '')}
      style={{ width: CARD_W, height: CARD_H, border: '1px solid #aaa' }}
    >
      <div className="absolute top-0.5 left-1.5 leading-tight" style={{ color: color, fontSize: 12, fontWeight: 'bold' }}>
        <div>{label}</div>
        <div style={{ marginTop: -2 }}>{sym}</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: color }}>
        <span style={{ fontSize: 30 }}>{sym}</span>
      </div>
      <div className="absolute bottom-0.5 right-1.5 leading-tight rotate-180" style={{ color: color, fontSize: 12, fontWeight: 'bold' }}>
        <div>{label}</div>
        <div style={{ marginTop: -2 }}>{sym}</div>
      </div>
    </div>
  );
});

var CardBack = memo(function() {
  return (
    <div
      className="relative rounded-sm overflow-hidden select-none card-shadow"
      style={{
        width: CARD_W, height: CARD_H,
        background: 'linear-gradient(135deg, #0a1628 0%, #162d6a 50%, #0a1628 100%)',
        border: '2px solid #c8962c',
      }}
    >
      <div className="absolute inset-1.5 border border-yellow-700/40 rounded-sm" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 60 72" style={{ width: 34, height: 40 }}>
          <path d="M30 6 L54 66 Q30 50 6 66 Z" fill="#c8962c" opacity="0.85" />
          <path d="M30 20 L44 58 Q30 48 16 58 Z" fill="#0d1b3e" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute" style={{ top: 8, left: 10, width: 2, height: 2, background: '#c8962c', borderRadius: '50%', opacity: 0.5 }} />
      <div className="absolute" style={{ top: 14, right: 12, width: 1.5, height: 1.5, background: '#c8962c', borderRadius: '50%', opacity: 0.4 }} />
      <div className="absolute" style={{ bottom: 10, left: 14, width: 1.5, height: 1.5, background: '#c8962c', borderRadius: '50%', opacity: 0.4 }} />
      <div className="absolute" style={{ bottom: 16, right: 10, width: 2, height: 2, background: '#c8962c', borderRadius: '50%', opacity: 0.5 }} />
    </div>
  );
});

var EmptySlot = memo(function({ label, highlight }) {
  return (
    <div
      className={'rounded-sm flex items-center justify-center select-none' + (highlight ? ' ring-2 ring-yellow-400/60' : '')}
      style={{ width: CARD_W, height: CARD_H, border: '2px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}
    >
      {label && <span className="text-2xl opacity-15 text-white">{label}</span>}
    </div>
  );
});

// ==================== VICTORY CASCADE ====================

function VictoryCascade({ onNewGame }) {
  var canvasRef = useRef(null);

  useEffect(function() {
    var canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var cards = [];
    var cardIdx = 0;
    var lastAdd = 0;

    var drawCard = function(c) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(c.x, c.y, 60, 84);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.strokeRect(c.x, c.y, 60, 84);
      var color = isRed(c.suit) ? '#dc2626' : '#1a1a2e';
      ctx.fillStyle = color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(SUIT_SYMBOLS[c.suit], c.x + 20, c.y + 52);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(RANK_LABELS[c.rank], c.x + 4, c.y + 16);
    };

    var animate = function(time) {
      if (time - lastAdd > 150 && cardIdx < 52) {
        var suitIdx = Math.floor(cardIdx / 13);
        cards.push({
          x: 380 + suitIdx * 92,
          y: 80,
          vx: (Math.random() - 0.5) * 10,
          vy: -Math.random() * 4 - 1,
          suit: SUITS[suitIdx],
          rank: (cardIdx % 13) + 1,
        });
        cardIdx++;
        lastAdd = time;
      }
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        c.vy += 0.5;
        c.x += c.vx;
        c.y += c.vy;
        if (c.y > canvas.height - 84) { c.vy *= -0.8; c.y = canvas.height - 84; }
        if (c.x < 0) { c.vx *= -0.9; c.x = 0; }
        if (c.x > canvas.width - 60) { c.vx *= -0.9; c.x = canvas.width - 60; }
        drawCard(c);
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[#c0c0c0] win95-window p-1 text-center" style={{ animation: 'winPulse 2s infinite' }}>
          <div className="title-bar text-white font-bold text-xs px-2 py-1 mb-1">Victory!</div>
          <div className="p-4">
            <p className="font-pixel text-sm mb-1" style={{ color: '#c8962c' }}>YOU WIN!</p>
            <p className="text-xs mb-3">All cards placed on foundations.</p>
            <button onClick={onNewGame} className="win95-btn bg-[#c0c0c0] px-4 py-1 text-xs cursor-pointer">
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
