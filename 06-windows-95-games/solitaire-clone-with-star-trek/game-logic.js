// ============================================================
// STAR TREK SOLITAIRE — Game Logic
// Pure JavaScript, no React dependency
// ============================================================

var SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

var SUIT_SYMBOLS = {
  hearts: '\u2665', diamonds: '\u2666', clubs: '\u2663', spades: '\u2660',
};

var SUIT_COLORS = {
  hearts: '#dc2626', diamonds: '#dc2626', clubs: '#1a1a2e', spades: '#1a1a2e',
};

var RANK_LABELS = {
  1:'A', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7',
  8:'8', 9:'9', 10:'10', 11:'J', 12:'Q', 13:'K',
};

var CARD_W = 80;
var CARD_H = 112;
var FDOWN_OFF = 18;
var FUP_OFF = 26;

function isRed(suit) {
  return suit === 'hearts' || suit === 'diamonds';
}

function createDeck() {
  var deck = [];
  for (var s = 0; s < SUITS.length; s++) {
    for (var rank = 1; rank <= 13; rank++) {
      deck.push({ id: SUITS[s] + '-' + rank, suit: SUITS[s], rank: rank, faceUp: false });
    }
  }
  return deck;
}

function shuffleDeck(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function dealNewGame() {
  var deck = shuffleDeck(createDeck());
  var tableau = [];
  var idx = 0;
  for (var col = 0; col < 7; col++) {
    tableau[col] = [];
    for (var row = 0; row <= col; row++) {
      var card = Object.assign({}, deck[idx++]);
      card.faceUp = (row === col);
      tableau[col].push(card);
    }
  }
  return {
    stock: deck.slice(idx),
    waste: [],
    tableau: tableau,
    foundations: [[], [], [], []],
    score: 0,
    moves: 0,
  };
}

function canPlaceOnTableau(card, pile) {
  if (pile.length === 0) return card.rank === 13;
  var top = pile[pile.length - 1];
  return top.faceUp && top.rank === card.rank + 1 && isRed(card.suit) !== isRed(top.suit);
}

function canPlaceOnFoundation(card, foundation) {
  if (foundation.length === 0) return card.rank === 1;
  var top = foundation[foundation.length - 1];
  return card.suit === top.suit && card.rank === top.rank + 1;
}

function isGameWon(state) {
  return state.foundations.every(function(f) { return f.length === 13; });
}

function suitToFoundationIndex(suit) {
  return SUITS.indexOf(suit);
}
