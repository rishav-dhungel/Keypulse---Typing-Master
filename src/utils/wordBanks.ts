import { AcademyLesson, QuoteLength } from '../types';

export const ENGLISH_200 = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'great', 'between', 'need', 'large', 'under', 'place', 'such', 'world', 'here',
  'still', 'state', 'point', 'right', 'turn', 'open', 'close', 'high', 'life', 'small',
  'hand', 'part', 'child', 'eye', 'never', 'last', 'let', 'thought', 'city', 'tree',
  'cross', 'farm', 'hard', 'start', 'might', 'story', 'saw', 'far', 'sea', 'draw',
  'left', 'late', 'run', 'while', 'press', 'close', 'night', 'real', 'life', 'few',
  'north', 'book', 'carry', 'took', 'science', 'eat', 'room', 'friend', 'began', 'idea',
  'fish', 'mountain', 'stop', 'once', 'base', 'hear', 'horse', 'cut', 'sure', 'watch',
  'color', 'face', 'wood', 'main', 'open', 'seem', 'together', 'next', 'white', 'children',
  'begin', 'got', 'walk', 'example', 'ease', 'paper', 'group', 'always', 'music', 'those',
  'both', 'mark', 'often', 'letter', 'until', 'mile', 'river', 'car', 'feet', 'care',
];

export const ENGLISH_1000_EXPANDED = [
  ...ENGLISH_200,
  'second', 'later', 'miss', 'study', 'food', 'body', 'system', 'build', 'ground', 'fall',
  'king', 'town', 'unit', 'reach', 'fast', 'true', 'listen', 'simple', 'several', 'vocal',
  'toward', 'step', 'hold', 'west', 'ground', 'interest', 'reach', 'fast', 'verb', 'sing',
  'listen', 'six', 'table', 'travel', 'less', 'morning', 'ten', 'simple', 'several', 'vocal',
  'toward', 'war', 'lay', 'against', 'pattern', 'slow', 'center', 'love', 'person', 'money',
  'serve', 'appear', 'road', 'map', 'rain', 'rule', 'govern', 'pull', 'cold', 'notice',
  'voice', 'energy', 'hunt', 'probable', 'bed', 'brother', 'egg', 'ride', 'cell', 'believe',
  'perhaps', 'pick', 'sudden', 'count', 'square', 'reason', 'length', 'represent', 'art', 'subject',
  'region', 'size', 'vary', 'settle', 'speak', 'weight', 'general', 'ice', 'matter', 'circle',
  'pair', 'include', 'divide', 'syllable', 'felt', 'grand', 'ball', 'yet', 'wave', 'drop',
  'heart', 'am', 'present', 'heavy', 'dance', 'engine', 'position', 'arm', 'wide', 'sail',
  'material', 'fraction', 'forest', 'sit', 'race', 'window', 'store', 'summer', 'train', 'sleep',
  'prove', 'lone', 'leg', 'exercise', 'wall', 'catch', 'mount', 'wish', 'sky', 'board',
  'joy', 'winter', 'sat', 'written', 'wild', 'instrument', 'kept', 'glass', 'grass', 'cow',
  'job', 'edge', 'sign', 'visit', 'past', 'soft', 'fun', 'bright', 'gas', 'weather',
  'month', 'million', 'bear', 'finish', 'happy', 'hope', 'flower', 'clothe', 'strange', 'gone',
  'trade', 'melody', 'trip', 'office', 'receive', 'row', 'mouth', 'exact', 'symbol', 'die',
  'least', 'trouble', 'shout', 'except', 'wrote', 'seed', 'tone', 'join', 'suggest', 'clean',
  'break', 'lady', 'yard', 'rise', 'bad', 'blow', 'oil', 'blood', 'touch', 'grew',
  'cent', 'mix', 'team', 'wire', 'cost', 'lost', 'brown', 'wear', 'garden', 'equal',
  'sent', 'choose', 'fell', 'fit', 'flow', 'fair', 'bank', 'collect', 'save', 'control',
  'decimal', 'ear', 'else', 'quite', 'broke', 'case', 'middle', 'kill', 'son', 'lake',
  'moment', 'scale', 'loud', 'spring', 'observe', 'child', 'straight', 'consonant', 'nation', 'dictionary',
  'milk', 'speed', 'method', 'organ', 'pay', 'age', 'section', 'dress', 'cloud', 'surprise',
  'quiet', 'stone', 'tiny', 'climb', 'cool', 'design', 'poor', 'lot', 'experiment', 'bottom',
  'key', 'iron', 'single', 'stick', 'flat', 'twenty', 'skin', 'smile', 'crease', 'hole',
  'jump', 'baby', 'eight', 'village', 'meet', 'root', 'buy', 'raise', 'solve', 'metal',
  'whether', 'push', 'seven', 'paragraph', 'third', 'shall', 'held', 'hair', 'describe', 'cook',
  'floor', 'either', 'result', 'burn', 'hill', 'safe', 'cat', 'century', 'consider', 'type',
  'law', 'bit', 'coast', 'copy', 'phrase', 'silent', 'tall', 'sand', 'soil', 'roll',
  'temperature', 'finger', 'industry', 'value', 'fight', 'lie', 'beat', 'excite', 'natural', 'view',
  'sense', 'capital', 'chair', 'danger', 'fruit', 'rich', 'thick', 'soldier', 'process', 'operate',
];

export const CODE_SNIPPETS = [
  'const calculateSpeed = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));',
  'function binarySearch(arr, target) { let left = 0; let right = arr.length - 1; }',
  'export default function useLocalStorage(key, initialValue) { const [val, setVal] = useState(); }',
  'const filtered = items.filter(item => item.accuracy >= 98).sort((a, b) => b.wpm - a.wpm);',
  'interface UserProfile { id: string; username: string; rank: number; score: number; }',
  'async function fetchData(url: string) { const res = await fetch(url); return res.json(); }',
  'document.addEventListener("keydown", (e) => { if (e.key === "Tab") resetTest(); });',
  'return array.reduce((acc, curr) => acc + curr, 0) / (array.length || 1);',
];

export interface Quote {
  text: string;
  author: string;
  length: 'short' | 'medium' | 'long';
}

export const QUOTES: Quote[] = [
  {
    text: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    length: "short",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    length: "short",
  },
  {
    text: "Code is like humor. When you have to explain it, it’s bad.",
    author: "Cory House",
    length: "short",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    length: "short",
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    length: "medium",
  },
  {
    text: "Practice does not make perfect. Only perfect practice makes perfect.",
    author: "Vince Lombardi",
    length: "medium",
  },
  {
    text: "Speed will come as a natural byproduct of relaxed, rhythmically consistent, and accurate muscle memory.",
    author: "Sean Wrona",
    length: "medium",
  },
  {
    text: "It is not that I'm so smart. But I stay with the questions much longer. Consistency and patience are the true masters of any complex skill.",
    author: "Albert Einstein",
    length: "medium",
  },
  {
    text: "First, solve the problem. Then, write the code. When your mind is clear and your fingers move effortlessly across the home row, every thought translates into fluid motion without friction.",
    author: "John Johnson",
    length: "long",
  },
  {
    text: "The craft of touch typing is not merely about mechanical velocity; it is the direct bridge between human cognition and digital creation. When typing becomes subconscious, focus shifts entirely to deep problem solving.",
    author: "KeyPulse Philosophy",
    length: "long",
  },
];

// Touch Typing Academy Curriculum: 6 structured stages, 18 progressive lessons
export const ACADEMY_LESSONS: AcademyLesson[] = [
  // Stage 1: Home Row
  {
    id: 'lesson-1',
    stageId: 1,
    stageTitle: 'Stage 1: Home Row Foundation',
    title: 'Anchor Keys: F & J',
    description: 'Find the tactile bumps on F (left index) and J (right index). Keep other fingers hovering softly.',
    newKeys: ['f', 'j', ' '],
    targetAccuracy: 95,
    minWpm: 15,
    text: 'f j fj jf ff jj fjf jfj fff jjj fjfj jfjf f j fj jf ff jj f j f j fj jf',
    fingerHints: 'Left index on F, right index on J. Use thumbs for Spacebar.',
  },
  {
    id: 'lesson-2',
    stageId: 1,
    stageTitle: 'Stage 1: Home Row Foundation',
    title: 'Middle Fingers: D & K',
    description: 'Learn D with your left middle finger and K with your right middle finger.',
    newKeys: ['d', 'k'],
    targetAccuracy: 95,
    minWpm: 18,
    text: 'd k dk kd fd jk df jk kdf jkd ddd kkk dfjk kjfd fjdk d k dk kd df jk kd',
    fingerHints: 'Left middle finger on D. Right middle finger on K.',
  },
  {
    id: 'lesson-3',
    stageId: 1,
    stageTitle: 'Stage 1: Home Row Foundation',
    title: 'Ring & Pinky: S, L, A, ;',
    description: 'Complete the home row with S, L, A, and semicolon (;).',
    newKeys: ['s', 'l', 'a', ';'],
    targetAccuracy: 95,
    minWpm: 20,
    text: 'asdf jkl; asdf jkl; fall glad flask salad lass ask fall dash jade flask hall; dad',
    fingerHints: 'Left pinky A, ring S. Right ring L, right pinky ;.',
  },
  {
    id: 'lesson-4',
    stageId: 1,
    stageTitle: 'Stage 1: Home Row Foundation',
    title: 'Center Stretch: G & H',
    description: 'Reach left index to G and right index to H, then return instantly to home base.',
    newKeys: ['g', 'h'],
    targetAccuracy: 96,
    minWpm: 22,
    text: 'fg jh gf hj glad flash dash half flag shall fall glass flash gas hash half gas',
    fingerHints: 'Left index stretches to G. Right index stretches to H. Return immediately.',
  },

  // Stage 2: Top Row
  {
    id: 'lesson-5',
    stageId: 2,
    stageTitle: 'Stage 2: Top Row Reach',
    title: 'Most Frequent Vowels: E & I',
    description: 'Left middle reaches up to E, right middle reaches up to I.',
    newKeys: ['e', 'i'],
    targetAccuracy: 95,
    minWpm: 24,
    text: 'de ki ed ik die kid like feed safe life side field file idea seek side kid',
    fingerHints: 'Left middle reaches up to E. Right middle reaches up to I.',
  },
  {
    id: 'lesson-6',
    stageId: 2,
    stageTitle: 'Stage 2: Top Row Reach',
    title: 'Index Upward: R & U',
    description: 'Left index reaches up to R, right index reaches up to U.',
    newKeys: ['r', 'u'],
    targetAccuracy: 95,
    minWpm: 25,
    text: 'fr ju rf uj red run rule fur rug fire ride true sure user figure order real',
    fingerHints: 'Left index up to R, right index up to U.',
  },
  {
    id: 'lesson-7',
    stageId: 2,
    stageTitle: 'Stage 2: Top Row Reach',
    title: 'Ring & Outer Top: W & O',
    description: 'Left ring reaches up to W, right ring reaches up to O.',
    newKeys: ['w', 'o'],
    targetAccuracy: 95,
    minWpm: 26,
    text: 'sw lo ws ol slow wool wood work flow world sword word show blow road row',
    fingerHints: 'Left ring reaches up to W, right ring reaches up to O.',
  },
  {
    id: 'lesson-8',
    stageId: 2,
    stageTitle: 'Stage 2: Top Row Reach',
    title: 'Full Top Row: Q, P, T, Y',
    description: 'Complete the entire top row with Q (left pinky), P (right pinky), T and Y.',
    newKeys: ['q', 'p', 't', 'y'],
    targetAccuracy: 95,
    minWpm: 28,
    text: 'quiet paper party pretty quality type power top reply output query quiet point poetry',
    fingerHints: 'Left pinky Q, right pinky P. Left index T, right index Y.',
  },

  // Stage 3: Bottom Row
  {
    id: 'lesson-9',
    stageId: 3,
    stageTitle: 'Stage 3: Bottom Row & Punctuation',
    title: 'Bottom Index Reach: V & M',
    description: 'Left index down to V, right index down to M.',
    newKeys: ['v', 'm'],
    targetAccuracy: 95,
    minWpm: 28,
    text: 'fv jm vf mj move view mail must calm give solve member volume game make visit',
    fingerHints: 'Left index reaches down-right to V. Right index down-left to M.',
  },
  {
    id: 'lesson-10',
    stageId: 3,
    stageTitle: 'Stage 3: Bottom Row & Punctuation',
    title: 'Middle Bottom: C & Comma (,)',
    description: 'Left middle reaches down to C, right middle reaches down to comma (,).',
    newKeys: ['c', ','],
    targetAccuracy: 95,
    minWpm: 30,
    text: 'dc k, cd ,k call, come, cycle, scale, click, voice, music, face, clear, check,',
    fingerHints: 'Left middle finger curls down to C. Right middle curls down to comma.',
  },
  {
    id: 'lesson-11',
    stageId: 3,
    stageTitle: 'Stage 3: Bottom Row & Punctuation',
    title: 'Full Bottom Row: X, Z, Period (.), Slash (/)',
    description: 'Master X, Z, Period, and remaining bottom characters.',
    newKeys: ['x', 'z', '.', '/'],
    targetAccuracy: 95,
    minWpm: 30,
    text: 'size. exact. zero. next. mix. zone. prize. context. text. complex. zoom. final.',
    fingerHints: 'Left ring X, left pinky Z. Right ring period (.), right pinky slash (/).',
  },

  // Stage 4: Capitalization & Shift
  {
    id: 'lesson-12',
    stageId: 4,
    stageTitle: 'Stage 4: Capitalization & Fluid Shift',
    title: 'Opposite-Hand Shift Mechanics',
    description: 'When typing a capital on the right hand, hold Shift with the left pinky, and vice-versa.',
    newKeys: ['Shift'],
    targetAccuracy: 96,
    minWpm: 32,
    text: 'The Quick Brown Fox Jumped Over The Lazy Dog. London, Paris, Tokyo, New York.',
    fingerHints: 'Right-hand capital -> Left Shift with pinky. Left-hand capital -> Right Shift.',
  },

  // Stage 5: Numbers & Symbols
  {
    id: 'lesson-13',
    stageId: 5,
    stageTitle: 'Stage 5: Numbers & Symbols',
    title: 'Number Row: 1, 2, 3, 4, 5',
    description: 'Reach up from left hand to the number row.',
    newKeys: ['1', '2', '3', '4', '5'],
    targetAccuracy: 95,
    minWpm: 25,
    text: '12 34 51 23 45 123 451 234 512 345 11 22 33 44 55 1245 5432 135 241',
    fingerHints: 'Pinky 1, Ring 2, Middle 3, Index 4 and 5.',
  },
  {
    id: 'lesson-14',
    stageId: 5,
    stageTitle: 'Stage 5: Numbers & Symbols',
    title: 'Number Row: 6, 7, 8, 9, 0',
    description: 'Reach up from right hand to the number row.',
    newKeys: ['6', '7', '8', '9', '0'],
    targetAccuracy: 95,
    minWpm: 25,
    text: '67 89 90 68 70 678 890 789 601 2026 1998 100 500 750 999 1000 6890',
    fingerHints: 'Index 6 and 7, Middle 8, Ring 9, Pinky 0.',
  },

  // Stage 6: Speed & Rhythm
  {
    id: 'lesson-15',
    stageId: 6,
    stageTitle: 'Stage 6: Speed & Flow State',
    title: 'Frequent Trigrams & Syllables',
    description: 'Build fast muscle memory chunks for the most common 3-letter combinations in English.',
    newKeys: ['the', 'and', 'ing', 'ion', 'ent'],
    targetAccuracy: 97,
    minWpm: 38,
    text: 'the and ing ion ent for that with mention thinking constant prevent action silent',
    fingerHints: 'Think in chunks and syllables rather than individual letters.',
  },
  {
    id: 'lesson-16',
    stageId: 6,
    stageTitle: 'Stage 6: Speed & Flow State',
    title: '50 WPM Benchmark Sprint',
    description: 'Consistent fluid velocity on balanced everyday vocabulary.',
    newKeys: [],
    targetAccuracy: 97,
    minWpm: 50,
    text: 'consistent practice every single day develops deep muscle memory that endures for a lifetime of effortless typing speed and clarity',
    fingerHints: 'Keep wrists elevated and relaxed. Breathe steadily with the typing pulse.',
  },
];

export function getRandomWords(count: number, dictionary: string[] = ENGLISH_200): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * dictionary.length);
    result.push(dictionary[idx]);
  }
  return result;
}

export function getRandomQuote(lengthFilter: QuoteLength = 'all'): Quote {
  const candidates = lengthFilter === 'all' ? QUOTES : QUOTES.filter((q) => q.length === lengthFilter);
  const pool = candidates.length > 0 ? candidates : QUOTES;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

export function generateWeakKeysText(missTypedKeys: Record<string, number>, count: number = 25): string {
  const topKeys = Object.entries(missTypedKeys)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.toLowerCase())
    .slice(0, 5);

  if (topKeys.length === 0) {
    return getRandomWords(count, ENGLISH_200).join(' ');
  }

  // Filter words that contain at least one of the weak keys
  const targetWords = ENGLISH_1000_EXPANDED.filter((w) => topKeys.some((k) => w.includes(k)));
  const pool = targetWords.length > 10 ? targetWords : ENGLISH_200;

  return getRandomWords(count, pool).join(' ');
}
