// ============================================================
// STAR TREK SOLITAIRE — Main App
// Game state, drag/drop, click logic, rendering
// ============================================================

function App() {
  var [game, setGame] = useState(dealNewGame);
  var [history, setHistory] = useState([]);
  var [timer, setTimer] = useState(0);
  var [timerActive, setTimerActive] = useState(false);
  var [gameWon, setGameWon] = useState(false);
  var [selected, setSelected] = useState(null);
  var [drawCount, setDrawCount] = useState(3);

  // Drag refs
  var dragLayerRef = useRef(null);
  var dragInfoRef = useRef(null);
  var [dragCards, setDragCards] = useState([]);
  var [dragSource, setDragSource] = useState(null);
  var pointerStartRef = useRef({ x: 0, y: 0 });
  var isDraggingRef = useRef(false);

  // Resize scaling
  var containerRef = useRef(null);
  var innerRef = useRef(null);
  var [scale, setScale] = useState(1);
  var BASE_W = 700;
  var BASE_H = 600;

  useEffect(function() {
    if (!containerRef.current) return;
    var ro = new ResizeObserver(function(entries) {
      var entry = entries[0];
      var cw = entry.contentRect.width;
      var ch = entry.contentRect.height;
      var sx = cw / BASE_W;
      var sy = ch / BASE_H;
      setScale(Math.min(sx, sy));
    });
    ro.observe(containerRef.current);
    return function() { ro.disconnect(); };
  }, []);

  // Timer
  useEffect(function() {
    if (!timerActive || gameWon) return;
    var id = setInterval(function() { setTimer(function(t) { return t + 1; }); }, 1000);
    return function() { clearInterval(id); };
  }, [timerActive, gameWon]);

  // Win check
  useEffect(function() {
    if (isGameWon(game) && !gameWon) setGameWon(true);
  }, [game]);

  var formatTime = function(s) {
    return Math.floor(s / 60) + ':' + (s % 60).toString().padStart(2, '0');
  };

  // === ACTIONS ===

  var saveAndApply = function(newState) {
    setHistory(function(h) { return h.concat([structuredClone(game)]); });
    setGame(newState);
    setSelected(null);
    if (!timerActive) setTimerActive(true);
  };

  var handleNewGame = function() {
    setGame(dealNewGame());
    setHistory([]);
    setTimer(0);
    setTimerActive(false);
    setGameWon(false);
    setSelected(null);
  };

  var handleUndo = function() {
    if (history.length === 0) return;
    setGame(history[history.length - 1]);
    setHistory(function(h) { return h.slice(0, -1); });
    setSelected(null);
  };

  var handleDraw = function() {
    var s = structuredClone(game);
    if (s.stock.length === 0) {
      if (s.waste.length === 0) return;
      s.stock = s.waste.reverse().map(function(c) { return Object.assign({}, c, { faceUp: false }); });
      s.waste = [];
      s.score = Math.max(0, s.score - 20);
    } else {
      var count = Math.min(drawCount, s.stock.length);
      var drawn = s.stock.splice(-count);
      drawn.forEach(function(c) { c.faceUp = true; });
      s.waste.push.apply(s.waste, drawn);
    }
    s.moves++;
    saveAndApply(s);
  };

  var toggleDrawCount = function() {
    setDrawCount(function(d) { return d === 3 ? 1 : 3; });
  };

  var tryMove = function(src, tgtType, tgtIndex) {
    var s = structuredClone(game);
    var movingCards = [];

    // Remove from source
    if (src.type === 'waste') {
      if (s.waste.length === 0) return false;
      movingCards = s.waste.splice(-1);
    } else if (src.type === 'tableau') {
      var pile = s.tableau[src.index];
      movingCards = pile.splice(src.cardIndex);
      if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
        pile[pile.length - 1].faceUp = true;
        s.score += 5;
      }
    } else if (src.type === 'foundation') {
      if (s.foundations[src.index].length === 0) return false;
      movingCards = s.foundations[src.index].splice(-1);
    }

    if (movingCards.length === 0) return false;

    // Place on target
    if (tgtType === 'tableau') {
      if (!canPlaceOnTableau(movingCards[0], s.tableau[tgtIndex])) return false;
      s.tableau[tgtIndex].push.apply(s.tableau[tgtIndex], movingCards);
      if (src.type === 'waste') s.score += 5;
      else if (src.type === 'foundation') s.score -= 15;
    } else if (tgtType === 'foundation') {
      if (movingCards.length > 1) return false;
      if (!canPlaceOnFoundation(movingCards[0], s.foundations[tgtIndex])) return false;
      s.foundations[tgtIndex].push(movingCards[0]);
      s.score += 10;
    } else {
      return false;
    }

    s.score = Math.max(0, s.score);
    s.moves++;
    saveAndApply(s);
    return true;
  };

  var autoMoveToFoundation = function(src, card) {
    var fIdx = suitToFoundationIndex(card.suit);
    if (canPlaceOnFoundation(card, game.foundations[fIdx])) {
      return tryMove(src, 'foundation', fIdx);
    }
    return false;
  };

  // === CLICK / SELECT LOGIC ===

  var handleCardClick = function(loc, card) {
    if (!card.faceUp) return;

    if (selected) {
      if (selected.type === loc.type && selected.index === loc.index && selected.cardIndex === loc.cardIndex) {
        setSelected(null);
        return;
      }
      if (loc.type === 'tableau') {
        if (tryMove(selected, 'tableau', loc.index)) return;
      }
      if (loc.type === 'foundation') {
        if (tryMove(selected, 'foundation', loc.index)) return;
      }
      setSelected(null);
      return;
    }

    setSelected(loc);
  };

  var handleEmptyClick = function(type, index) {
    if (selected) {
      tryMove(selected, type, index);
      setSelected(null);
    }
  };

  var handleDoubleClick = function(loc, card) {
    if (!card.faceUp) return;
    autoMoveToFoundation(loc, card);
  };

  // === DRAG AND DROP ===

  var handlePointerDown = function(e, loc, card) {
    if (!card.faceUp || e.button !== 0) return;
    e.preventDefault();
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;

    var cards = [];
    if (loc.type === 'tableau') {
      cards = game.tableau[loc.index].slice(loc.cardIndex);
    } else if (loc.type === 'waste') {
      cards = [game.waste[game.waste.length - 1]];
    } else if (loc.type === 'foundation') {
      cards = [game.foundations[loc.index][game.foundations[loc.index].length - 1]];
    }

    var rect = e.target.closest('[data-card]');
    rect = rect ? rect.getBoundingClientRect() : null;
    var offX = rect ? e.clientX - rect.left : 40;
    var offY = rect ? e.clientY - rect.top : 10;

    dragInfoRef.current = { cards: cards, source: loc, offX: offX, offY: offY };
    var localDragLayerRef = dragLayerRef;

    var onMove = function(ev) {
      var dx = ev.clientX - pointerStartRef.current.x;
      var dy = ev.clientY - pointerStartRef.current.y;
      if (!isDraggingRef.current && Math.sqrt(dx * dx + dy * dy) < 5) return;

      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
        setDragCards(cards);
        setDragSource(loc);
      }

      if (localDragLayerRef.current) {
        localDragLayerRef.current.style.left = (ev.clientX - offX) + 'px';
        localDragLayerRef.current.style.top = (ev.clientY - offY) + 'px';
      }
    };

    var onUp = function(ev) {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);

      if (isDraggingRef.current && dragInfoRef.current) {
        var els = document.elementsFromPoint(ev.clientX, ev.clientY);
        var target = null;
        for (var i = 0; i < els.length; i++) {
          if (els[i].dataset && els[i].dataset.pileType) {
            target = els[i];
            break;
          }
        }

        if (target) {
          var tType = target.dataset.pileType;
          var tIdx = parseInt(target.dataset.pileIndex || '0');
          tryMove(dragInfoRef.current.source, tType, tIdx);
        }
      }

      isDraggingRef.current = false;
      dragInfoRef.current = null;
      setDragCards([]);
      setDragSource(null);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  // Is a card part of the current drag?
  var isDraggedCard = function(cardId) {
    return dragCards.some(function(c) { return c.id === cardId; });
  };

  // Is a card the selected card?
  var isSelectedCard = function(loc) {
    return selected && selected.type === loc.type && selected.index === loc.index && selected.cardIndex === loc.cardIndex;
  };

  // === RENDER HELPERS ===

  var renderCard = function(card, loc, style) {
    var dragged = isDraggedCard(card.id);
    var sel = isSelectedCard(loc);
    return (
      <div
        key={card.id}
        data-card={card.id}
        className={'absolute cursor-pointer' + (sel ? ' ring-2 ring-yellow-400 ring-offset-1 rounded-sm z-10' : '')}
        style={Object.assign({}, style || {}, { opacity: dragged ? 0.3 : 1 })}
        onClick={function(e) { e.stopPropagation(); handleCardClick(loc, card); }}
        onDoubleClick={function(e) { e.stopPropagation(); handleDoubleClick(loc, card); }}
        onPointerDown={function(e) { handlePointerDown(e, loc, card); }}
      >
        {card.faceUp ? <CardFace card={card} /> : <CardBack />}
      </div>
    );
  };

  // Waste: show top cards fanned (up to drawCount)
  var wasteShowCount = drawCount === 1 ? 1 : 3;
  var wasteVisible = game.waste.slice(-wasteShowCount);

  return (
    <>
      <Starfield />

      {/* Resizable Win95 Window */}
      <div className="fixed inset-0 z-10 flex items-start justify-center pt-4 pb-4 overflow-auto">
        <div
          ref={containerRef}
          className="bg-[#c0c0c0] win95-window p-[3px] select-none game-container flex flex-col"
          style={{ width: BASE_W, height: BASE_H }}
        >

          {/* Title Bar */}
          <div className="title-bar text-white flex items-center justify-between px-2 py-0.5 text-xs font-bold flex-none">
            <div className="flex items-center gap-1">
              <span>{'\uD83C\uDCCF'}</span>
              <span>Star Trek Solitaire</span>
            </div>
            <div className="flex gap-0.5">
              <button className="w-4 h-3.5 bg-[#c0c0c0] text-black text-[9px] flex items-center justify-center" style={{ border:'1px solid #fff', borderRight:'1px solid #404040', borderBottom:'1px solid #404040' }}>_</button>
              <button className="w-4 h-3.5 bg-[#c0c0c0] text-black text-[9px] flex items-center justify-center" style={{ border:'1px solid #fff', borderRight:'1px solid #404040', borderBottom:'1px solid #404040' }}>{'\u25a1'}</button>
              <button className="w-4 h-3.5 bg-[#c0c0c0] text-black text-[10px] flex items-center justify-center" style={{ border:'1px solid #fff', borderRight:'1px solid #404040', borderBottom:'1px solid #404040' }}>{'\u00d7'}</button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-[#c0c0c0] flex items-center gap-2 px-2 py-1 border-b border-[#808080] flex-none">
            <button onClick={handleNewGame} className="win95-btn bg-[#c0c0c0] px-3 py-0.5 text-[11px] cursor-pointer">New Game</button>
            <button onClick={handleUndo} disabled={history.length === 0} className="win95-btn bg-[#c0c0c0] px-3 py-0.5 text-[11px] cursor-pointer">Undo</button>
            <button onClick={toggleDrawCount} className="win95-btn bg-[#c0c0c0] px-3 py-0.5 text-[11px] cursor-pointer">
              {'Draw: ' + drawCount}
            </button>
          </div>

          {/* Green felt area — fills all remaining space */}
          <div className="win95-sunken flex-1 relative overflow-hidden" style={{ background: '#1a472a' }}>
            {/* Scaled card content inside */}
            <div
              ref={innerRef}
              className="game-scaler p-3"
              style={{ transform: 'scale(' + scale + ')', width: BASE_W }}
            >

              {/* Top Row: Stock, Waste, Foundations */}
              <div className="flex justify-between mb-4">
                {/* Stock & Waste */}
                <div className="flex gap-3">
                  {/* Stock */}
                  <div
                    className="cursor-pointer"
                    data-pile-type="stock"
                    data-pile-index="0"
                    onClick={handleDraw}
                  >
                    {game.stock.length > 0 ? (
                      <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
                        <CardBack />
                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded font-pixel">
                          {game.stock.length}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="rounded-sm flex items-center justify-center"
                        style={{ width: CARD_W, height: CARD_H, border: '2px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)' }}
                      >
                        <span className="text-white/20 text-2xl">{'\u21BB'}</span>
                      </div>
                    )}
                  </div>

                  {/* Waste */}
                  <div
                    className="relative"
                    data-pile-type="waste"
                    data-pile-index="0"
                    style={{ width: CARD_W + (wasteShowCount > 1 ? 40 : 0), height: CARD_H }}
                    onClick={function() { handleEmptyClick('waste', 0); }}
                  >
                    {wasteVisible.length === 0 && <EmptySlot />}
                    {wasteVisible.map(function(card, i) {
                      var offset = wasteShowCount > 1 ? i * 20 : 0;
                      var isTop = i === wasteVisible.length - 1;
                      var realIdx = game.waste.length - wasteVisible.length + i;
                      var loc = { type: 'waste', index: 0, cardIndex: realIdx };
                      if (isTop) {
                        return renderCard(card, loc, { left: offset, top: 0 });
                      }
                      return (
                        <div key={card.id} className="absolute" style={{ left: offset, top: 0 }}>
                          <CardFace card={card} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Foundations */}
                <div className="flex gap-3">
                  {game.foundations.map(function(foundation, fi) {
                    return (
                      <div
                        key={fi}
                        className="relative"
                        data-pile-type="foundation"
                        data-pile-index={fi}
                        style={{ width: CARD_W, height: CARD_H }}
                        onClick={function() { handleEmptyClick('foundation', fi); }}
                      >
                        {foundation.length === 0 ? (
                          <EmptySlot label={SUIT_SYMBOLS[SUITS[fi]]} highlight={selected !== null} />
                        ) : (
                          renderCard(
                            foundation[foundation.length - 1],
                            { type: 'foundation', index: fi, cardIndex: foundation.length - 1 },
                            { left: 0, top: 0 }
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tableau */}
              <div className="flex gap-3">
                {game.tableau.map(function(pile, ti) {
                  var pileH = pile.length === 0 ? CARD_H
                    : pile.reduce(function(acc, c, i) {
                        return acc + (i < pile.length - 1 ? (c.faceUp ? FUP_OFF : FDOWN_OFF) : CARD_H);
                      }, 0);
                  return (
                    <div
                      key={ti}
                      className="relative"
                      data-pile-type="tableau"
                      data-pile-index={ti}
                      style={{ width: CARD_W, minHeight: CARD_H, height: pileH }}
                      onClick={function() { handleEmptyClick('tableau', ti); }}
                    >
                      {pile.length === 0 && <EmptySlot highlight={selected !== null} />}
                      {pile.map(function(card, ci) {
                        var top = 0;
                        for (var k = 0; k < ci; k++) {
                          top += pile[k].faceUp ? FUP_OFF : FDOWN_OFF;
                        }
                        var loc = { type: 'tableau', index: ti, cardIndex: ci };
                        return renderCard(card, loc, { left: 0, top: top });
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-[#c0c0c0] flex items-center text-[11px] border-t border-white flex-none">
            <div className="win95-sunken px-3 py-0.5 flex-1">Score: {game.score}</div>
            <div className="win95-sunken px-3 py-0.5 flex-1">Time: {formatTime(timer)}</div>
            <div className="win95-sunken px-3 py-0.5 flex-1">Moves: {game.moves}</div>
          </div>
        </div>
      </div>

      {/* Drag Layer */}
      {dragCards.length > 0 && (
        <div
          ref={dragLayerRef}
          className="fixed z-40 pointer-events-none"
          style={{ left: pointerStartRef.current.x, top: pointerStartRef.current.y, transform: 'scale(' + scale + ')', transformOrigin: 'top left' }}
        >
          {dragCards.map(function(card, i) {
            return (
              <div key={card.id} className="absolute drag-card" style={{ top: i * FUP_OFF, left: 0 }}>
                <CardFace card={card} />
              </div>
            );
          })}
        </div>
      )}

      {/* Victory */}
      {gameWon && <VictoryCascade onNewGame={handleNewGame} />}
    </>
  );
}

// ==================== RENDER ====================

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
