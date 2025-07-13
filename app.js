// Updated JavaScript with improved error handling and multiple sample articles

// Application state
const state = {
  currentCategory: 'business',
  currentArticle: '',
  typedText: '',
  startTime: null,
  isTestActive: false,
  isTestComplete: false,
  timer: null,
  currentCharIndex: 0,
  errors: 0,
  correctChars: 0,
  totalChars: 0,
  lastSampleIndex: -1 // tracks last sample to avoid repeats
};

// Sample data fallback (multiple articles per category for variety)
const sampleArticles = {
  business: [
    'Apple Inc. reported strong quarterly earnings driven by iPhone sales and services growth. Revenue reached $89.5 billion, marking a five-percent increase from the previous year.',
    'Global markets rallied today after the Federal Reserve signaled it would maintain current interest rates. Analysts predict continued growth in the tech sector.',
    'Tesla announced plans to build a new Gigafactory in Mexico, expanding its production capacity for electric vehicles and creating thousands of jobs.'
  ],
  technology: [
    'Artificial intelligence continues to reshape the tech landscape as major firms invest billions in research and development. Safety and ethics remain key concerns among experts.',
    'Quantum computing breakthroughs promise to solve complex problems far beyond the capabilities of classical machines, sparking a new era of innovation.',
    'Cybersecurity threats are on the rise, prompting companies to adopt zero-trust architectures and advanced encryption methods to protect user data.'
  ],
  sports: [
    'The NBA season enters its final stretch with several teams vying for playoff positions. Star players like Nikola Jokić and Jayson Tatum continue to deliver exceptional performances.',
    'In a stunning upset, the underdog team won the national soccer championship, delighting fans and rewriting the record books.',
    'Olympic athletes begin their final preparations as the summer games approach, focusing on peak performance and injury prevention.'
  ],
  health: [
    'Recent studies show that regular exercise and balanced nutrition significantly improve mental health and cognitive function.',
    'Researchers have developed a new vaccine that shows promise in preventing seasonal flu with higher efficacy and fewer side effects.',
    'Mindfulness practices such as meditation and yoga are gaining popularity as effective tools for reducing stress and anxiety.'
  ],
  science: [
    'Astronomers discovered an Earth-like exoplanet located within the habitable zone of its star, renewing hopes of finding extraterrestrial life.',
    'A breakthrough in renewable energy storage could make solar and wind power more reliable, accelerating the transition to a carbon-neutral future.',
    'Marine biologists identified a new species of deep-sea coral that thrives in extreme conditions, expanding our understanding of ocean ecosystems.'
  ],
  entertainment: [
    'The latest blockbuster film shattered opening-weekend box-office records, earning praise for its innovative visual effects and compelling storyline.',
    'An acclaimed director announced a new streaming series inspired by classic science-fiction novels, stirring excitement among genre fans.',
    'Music festivals around the world are adopting sustainable practices, reducing waste and promoting eco-friendly initiatives for concertgoers.'
  ]
};

// API configuration
const apiConfig = {
  baseUrl: 'https://newsapi.org/v2/top-headlines',
  proxyUrl: 'https://api.allorigins.win/get?url=',
  demoApiKey: 'demo_key_for_testing',
  defaultCountry: 'us',
  maxArticles: 5
};

// DOM elements
const elements = {
  categoryButtons: document.querySelectorAll('.category-btn'),
  articleDisplay: document.getElementById('article-display'),
  articleCategory: document.getElementById('article-category'),
  articleLength: document.getElementById('article-length'),
  typingInput: document.getElementById('typing-input'),
  progressFill: document.getElementById('progress-fill'),
  wpmValue: document.getElementById('wpm-value'),
  accuracyValue: document.getElementById('accuracy-value'),
  timeValue: document.getElementById('time-value'),
  errorsValue: document.getElementById('errors-value'),
  resetBtn: document.getElementById('reset-btn'),
  newArticleBtn: document.getElementById('new-article-btn'),
  resultsModal: document.getElementById('results-modal'),
  finalWpm: document.getElementById('final-wpm'),
  finalAccuracy: document.getElementById('final-accuracy'),
  finalTime: document.getElementById('final-time'),
  finalErrors: document.getElementById('final-errors'),
  tryAgainBtn: document.getElementById('try-again-btn'),
  newCategoryBtn: document.getElementById('new-category-btn'),
  errorMessage: document.getElementById('error-message'),
  retryBtn: document.getElementById('retry-btn')
};

// Initialize the application
function init() {
  setupEventListeners();
  loadArticle();
}

// Setup all event listeners
function setupEventListeners() {
  // Category buttons
  elements.categoryButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      selectCategory(e.target.dataset.category);
    });
  });

  // Typing input
  elements.typingInput.addEventListener('input', handleTyping);
  elements.typingInput.addEventListener('keydown', handleKeyDown);
  elements.typingInput.addEventListener('focus', () => {
    if (!state.isTestActive && state.currentArticle) {
      startTest();
    }
  });

  // Control buttons
  elements.resetBtn.addEventListener('click', resetTest);
  elements.newArticleBtn.addEventListener('click', loadNewArticle);
  elements.tryAgainBtn.addEventListener('click', () => {
    hideModal();
    resetTest();
  });
  elements.newCategoryBtn.addEventListener('click', () => {
    hideModal();
    resetTest();
    // Cycle through categories
    const categories = Object.keys(sampleArticles);
    const currentIndex = categories.indexOf(state.currentCategory);
    const newCategory = categories[(currentIndex + 1) % categories.length];
    selectCategory(newCategory);
  });
  elements.retryBtn.addEventListener('click', loadArticle);

  // Close modal on background click
  elements.resultsModal.addEventListener('click', (e) => {
    if (e.target === elements.resultsModal) hideModal();
  });
}

// Select a news category
function selectCategory(category) {
  state.currentCategory = category;

  // Update active button
  elements.categoryButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  // Update category display
  elements.articleCategory.textContent =
    category.charAt(0).toUpperCase() + category.slice(1);

  // Load new article
  loadArticle();
}

// Attempt to fetch news article, with graceful fallback to samples
async function loadArticle() {
  showLoading();
  hideError();

  try {
    const article = await fetchNewsArticle();
    displayArticle(article);
  } catch (error) {
    console.warn('News API unavailable, using sample data:', error.message);
    const sample = getRandomSample(state.currentCategory);
    displayArticle(sample);
    // We no longer show an error popup because the fallback is seamless
  }
}

// Fetch news article via AllOrigins CORS proxy
async function fetchNewsArticle() {
  const url = `${apiConfig.baseUrl}?country=${apiConfig.defaultCountry}&category=${state.currentCategory}&apiKey=${apiConfig.demoApiKey}&pageSize=${apiConfig.maxArticles}`;
  const proxied = `${apiConfig.proxyUrl}${encodeURIComponent(url)}`;

  const response = await fetch(proxied, { cache: 'no-store' });
  if (!response.ok) throw new Error('Network response was not ok');

  const payload = await response.json();
  const news = JSON.parse(payload.contents);
  if (!news.articles || news.articles.length === 0) throw new Error('No articles found');

  const chosen = news.articles[Math.floor(Math.random() * news.articles.length)];
  const combined = `${chosen.title}. ${chosen.description || ''} ${chosen.content || ''}`.replace(/\[.*?\]|\(.*?\)|https?:\/\/\S+/g, '').trim();
  return combined.substring(0, 500);
}

// Retrieve a random sample article (ensuring variety)
function getRandomSample(category) {
  const list = sampleArticles[category] || sampleArticles.business;
  if (list.length === 1) return list[0];

  let index;
  do {
    index = Math.floor(Math.random() * list.length);
  } while (index === state.lastSampleIndex);
  state.lastSampleIndex = index;
  return list[index];
}

// Display article and reset test state
function displayArticle(text) {
  state.currentArticle = text;
  elements.articleLength.textContent = `${text.length} characters`;
  resetTest();
  highlightText(); // Show initial highlight
}

// Show loading skeleton
function showLoading() {
  elements.articleDisplay.innerHTML = '<div class="loading">Loading news article...</div>';
}

// Hide error message popup
function hideError() {
  elements.errorMessage.classList.remove('show');
}

// Load a different article within the same category
function loadNewArticle() {
  loadArticle();
}

/* -------------------- Typing Test Logic -------------------- */
function startTest() {
  state.isTestActive = true;
  state.startTime = Date.now();
  state.timer = setInterval(updateTimer, 100);
}

function handleTyping(e) {
  if (state.isTestComplete) return;
  if (!state.isTestActive) startTest();

  state.typedText = e.target.value;

  if (state.typedText.length >= state.currentArticle.length) {
    completeTest();
    return;
  }

  calculateStats();
  updateDisplay();
  updateProgress();
}

function handleKeyDown(e) {
  if (e.key === 'Tab') e.preventDefault();
}

function calculateStats() {
  const now = Date.now();
  const minutes = (now - state.startTime) / 60000;

  let correct = 0,
    errors = 0;
  for (let i = 0; i < state.typedText.length; i++) {
    if (state.typedText[i] === state.currentArticle[i]) correct++;
    else errors++;
  }

  state.correctChars = correct;
  state.errors = errors;
  state.totalChars = state.typedText.length;
  state.wpm = minutes ? Math.round((correct / 5) / minutes) : 0;
  state.accuracy = state.totalChars ? Math.round((correct / state.totalChars) * 100) : 100;
}

function updateDisplay() {
  elements.wpmValue.textContent = state.wpm;
  elements.accuracyValue.textContent = `${state.accuracy}%`;
  elements.errorsValue.textContent = state.errors;
  highlightText();
}

function highlightText() {
  const { currentArticle, typedText } = state;
  let html = '';

  for (let i = 0; i < currentArticle.length; i++) {
    const char = currentArticle[i];
    if (i < typedText.length) {
      html += typedText[i] === char ? `<span class="char-correct">${char}</span>` : `<span class="char-incorrect">${char}</span>`;
    } else if (i === typedText.length) {
      html += `<span class="char-current">${char}</span>`;
    } else {
      html += char;
    }
  }

  elements.articleDisplay.innerHTML = html;
}

function updateProgress() {
  const percent = (state.typedText.length / state.currentArticle.length) * 100;
  elements.progressFill.style.width = `${percent}%`;
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = String(elapsed % 60).padStart(2, '0');
  elements.timeValue.textContent = `${m}:${s}`;
}

function completeTest() {
  state.isTestComplete = true;
  state.isTestActive = false;
  clearInterval(state.timer);
  calculateStats(); // final stats
  updateDisplay();
  elements.typingInput.classList.add('typing-complete');
  elements.typingInput.disabled = true;
  showResults();
}

function showResults() {
  elements.finalWpm.textContent = state.wpm;
  elements.finalAccuracy.textContent = `${state.accuracy}%`;
  elements.finalTime.textContent = elements.timeValue.textContent;
  elements.finalErrors.textContent = state.errors;
  elements.resultsModal.classList.add('show');
}

function hideModal() {
  elements.resultsModal.classList.remove('show');
}

function resetTest() {
  clearInterval(state.timer);
  state.typedText = '';
  state.startTime = null;
  state.isTestActive = false;
  state.isTestComplete = false;
  state.timer = null;
  state.errors = 0;
  state.correctChars = 0;
  state.totalChars = 0;
  state.wpm = 0;
  state.accuracy = 100;

  elements.typingInput.value = '';
  elements.typingInput.disabled = false;
  elements.typingInput.classList.remove('typing-complete');
  elements.wpmValue.textContent = '0';
  elements.accuracyValue.textContent = '100%';
  elements.errorsValue.textContent = '0';
  elements.timeValue.textContent = '0:00';
  elements.progressFill.style.width = '0%';
  highlightText();
}

// Pause timer if page hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.timer) clearInterval(state.timer);
  else if (!document.hidden && state.isTestActive && !state.timer) state.timer = setInterval(updateTimer, 100);
});

window.addEventListener('beforeunload', (e) => {
  if (state.isTestActive && !state.isTestComplete) {
    e.preventDefault();
    e.returnValue = '';
  }
});

document.addEventListener('DOMContentLoaded', init);

// Export for tests (optional)
if (typeof module !== 'undefined') module.exports = { getRandomSample, calculateStats };