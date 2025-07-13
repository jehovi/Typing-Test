// Enhanced Daily News Typing Test Application - Fixed Version

// Application state
const state = {
  currentCategory: 'business',
  currentArticle: '',
  articleMetadata: { title: '', source: '', date: '' },
  selectedLength: 'medium',
  typedText: '',
  startTime: null,
  isTestActive: false,
  isTestComplete: false,
  timer: null,
  errors: 0,
  correctChars: 0,
  wpm: 0,
  accuracy: 100,
  lastSampleIndex: -1
};

// Article length configurations
const lengthConfig = {
  short: { words: 30 },
  medium: { words: 60 },
  long: { words: 120 }
};

// Enhanced sample articles with metadata
const sampleArticles = {
  business: [
    {
      title: "Tech Giants Report Strong Q3 Earnings Despite Market Volatility",
      source: "Business Today",
      date: "2025-07-13",
      content: "Apple, Microsoft, and Google parent company Alphabet all exceeded Wall Street expectations in their third-quarter earnings reports, demonstrating the resilience of the technology sector amid broader economic uncertainty. Apple's revenue reached $94.8 billion, driven by strong iPhone 15 sales and growing services revenue. Microsoft's cloud computing division Azure continued its impressive growth trajectory, posting 29% year-over-year growth. Meanwhile, Alphabet's advertising revenue rebounded strongly after several quarters of slower growth."
    },
    {
      title: "Global Supply Chain Disruptions Ease as Trade Routes Normalize",
      source: "Economic Times",
      date: "2025-07-12",
      content: "International shipping costs have declined by 40% over the past six months as global supply chain bottlenecks continue to ease, providing relief to businesses and consumers worldwide. The normalization of trade routes through the Suez Canal and improved port efficiency in major shipping hubs have contributed to the stabilization. Manufacturing companies report shorter lead times and improved inventory management capabilities."
    }
  ],
  technology: [
    {
      title: "Revolutionary Quantum Computing Breakthrough Promises Exponential Speed Gains",
      source: "Tech Innovation Daily",
      date: "2025-07-13",
      content: "Scientists at MIT have achieved a major breakthrough in quantum computing by developing a new error-correction system that could make quantum computers 1000 times more reliable than current systems. The breakthrough involves using a novel approach to quantum error correction that maintains quantum coherence for extended periods, addressing one of the biggest obstacles to practical quantum computing. The research team successfully demonstrated quantum calculations that would take classical computers millions of years to complete."
    },
    {
      title: "AI-Powered Medical Diagnostics Achieve 98% Accuracy in Cancer Detection",
      source: "MedTech News",
      date: "2025-07-12",
      content: "A new artificial intelligence system developed by researchers at Stanford Medical School has achieved a 98% accuracy rate in detecting early-stage cancer from medical imaging, surpassing the performance of human radiologists. The system, called OncoAI, uses advanced machine learning algorithms trained on over 500,000 medical images to identify subtle patterns that indicate the presence of cancerous tissue."
    }
  ],
  sports: [
    {
      title: "Tennis Championship Delivers Historic Upset as Underdog Claims Victory",
      source: "Sports Central",
      date: "2025-07-13",
      content: "In one of the most shocking upsets in tennis history, 19-year-old qualifier Maria Rodriguez defeated three-time Grand Slam champion and world number one Sarah Johnson in straight sets at the International Tennis Championship. Rodriguez, ranked 127th in the world, played flawlessly throughout the match, showcasing powerful groundstrokes and exceptional court coverage that left spectators and analysts speechless."
    },
    {
      title: "Olympic Swimming Records Shattered as New Training Methods Prove Effective",
      source: "Olympic Sports Today",
      date: "2025-07-12",
      content: "Three world records were broken at the World Swimming Championships this weekend, with athletes crediting revolutionary new training techniques that combine traditional methods with cutting-edge technology. American swimmer Jake Thompson set a new world record in the 200-meter freestyle, improving the previous mark by 0.23 seconds."
    }
  ],
  health: [
    {
      title: "Groundbreaking Gene Therapy Treatment Shows Promise for Rare Diseases",
      source: "Health Sciences Weekly",
      date: "2025-07-13",
      content: "A revolutionary gene therapy treatment has shown remarkable success in treating patients with rare genetic disorders, offering hope to millions of families worldwide. The treatment, developed by a team of researchers at Johns Hopkins University, uses advanced CRISPR technology to correct genetic mutations at the cellular level. In clinical trials, 89% of patients with previously incurable genetic conditions showed significant improvement."
    },
    {
      title: "Mental Health Apps Show Significant Impact on Depression and Anxiety Treatment",
      source: "Digital Health Today",
      date: "2025-07-12",
      content: "A comprehensive study involving 50,000 participants has demonstrated that mental health apps can be as effective as traditional therapy for treating mild to moderate depression and anxiety. The research, conducted by the American Psychological Association, found that users of evidence-based mental health apps showed a 40% reduction in symptoms over a 12-week period."
    }
  ],
  science: [
    {
      title: "Mars Rover Discovers Evidence of Ancient Microbial Life in Rock Samples",
      source: "Space Research Institute",
      date: "2025-07-13",
      content: "NASA's Perseverance rover has discovered compelling evidence of ancient microbial life on Mars, marking a historic moment in space exploration and astrobiology. The discovery came from analysis of rock samples collected from an ancient river delta in Jezero Crater. Scientists found organic compounds and mineral structures that strongly suggest the presence of microorganisms billions of years ago."
    },
    {
      title: "Renewable Energy Storage Breakthrough Could Revolutionize Green Power",
      source: "Environmental Science Today",
      date: "2025-07-12",
      content: "Scientists at the University of Cambridge have developed a new battery technology that could store renewable energy for months without significant power loss, potentially solving one of the biggest challenges facing clean energy adoption. The breakthrough involves using advanced materials that can store electrical energy at the molecular level, maintaining 95% efficiency even after extended storage periods."
    }
  ],
  entertainment: [
    {
      title: "Streaming Wars Intensify as New Platform Launches with Exclusive Content",
      source: "Entertainment Weekly",
      date: "2025-07-13",
      content: "The streaming landscape became even more competitive this week with the launch of Horizon+, a new platform backed by major Hollywood studios and featuring exclusive content from top creators. The service launched with original series starring A-list actors and directors who have moved from traditional television to streaming platforms. Industry analysts predict that Horizon+ could capture significant market share."
    },
    {
      title: "Virtual Reality Gaming Reaches New Heights with Haptic Feedback Technology",
      source: "Gaming Industry Report",
      date: "2025-07-12",
      content: "The gaming industry has reached a new milestone with the introduction of advanced haptic feedback technology that allows players to feel physical sensations in virtual reality games. The new system, developed by a collaboration between major gaming companies and tech manufacturers, provides realistic tactile feedback that enhances the immersive gaming experience."
    }
  ]
};

// DOM elements
let elements = {};

// Initialize the application
function init() {
  // Get DOM elements
  elements = {
    categoryButtons: document.querySelectorAll('.category-btn'),
    lengthSelect: document.getElementById('length-select'),
    articleTitle: document.getElementById('article-title'),
    articleSource: document.getElementById('article-source'),
    articleDate: document.getElementById('article-date'),
    articleCategory: document.getElementById('article-category'),
    articleDisplay: document.getElementById('article-display'),
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
    newCategoryBtn: document.getElementById('new-category-btn')
  };

  setupEventListeners();
  loadArticle();
}

// Setup event listeners
function setupEventListeners() {
  // Category buttons
  elements.categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.dataset.category;
      if (category) {
        selectCategory(category);
      }
    });
  });

  // Length selector
  if (elements.lengthSelect) {
    elements.lengthSelect.addEventListener('change', (e) => {
      state.selectedLength = e.target.value;
      loadArticle();
    });
  }

  // Typing input
  if (elements.typingInput) {
    elements.typingInput.addEventListener('input', handleTyping);
    elements.typingInput.addEventListener('focus', () => {
      if (!state.isTestActive && state.currentArticle) {
        startTest();
      }
    });
  }

  // Control buttons
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetTest();
    });
  }

  if (elements.newArticleBtn) {
    elements.newArticleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadArticle();
    });
  }

  if (elements.tryAgainBtn) {
    elements.tryAgainBtn.addEventListener('click', () => {
      hideModal();
      resetTest();
    });
  }

  if (elements.newCategoryBtn) {
    elements.newCategoryBtn.addEventListener('click', () => {
      hideModal();
      const categories = Object.keys(sampleArticles);
      const currentIndex = categories.indexOf(state.currentCategory);
      const nextCategory = categories[(currentIndex + 1) % categories.length];
      selectCategory(nextCategory);
    });
  }

  // Close modal on outside click
  if (elements.resultsModal) {
    elements.resultsModal.addEventListener('click', (e) => {
      if (e.target === elements.resultsModal) hideModal();
    });
  }
}

// Select category
function selectCategory(category) {
  if (!category || category === state.currentCategory) return;
  
  state.currentCategory = category;
  state.lastSampleIndex = -1; // Reset to ensure we get different articles
  
  // Update active button
  elements.categoryButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  // Update display
  if (elements.articleCategory) {
    elements.articleCategory.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  }

  // Load new article with slight delay to show loading state
  setTimeout(() => {
    loadArticle();
  }, 100);
}

// Load article
function loadArticle() {
  showLoading();
  
  // Get a new article
  const article = getRandomSampleArticle();
  
  // Simulate loading delay
  setTimeout(() => {
    displayArticle(article);
  }, 300);
}

// Get random sample article
function getRandomSampleArticle() {
  const articles = sampleArticles[state.currentCategory] || sampleArticles.business;
  let index;
  
  if (articles.length === 1) {
    index = 0;
  } else {
    do {
      index = Math.floor(Math.random() * articles.length);
    } while (index === state.lastSampleIndex);
  }
  
  state.lastSampleIndex = index;
  const article = articles[index];
  
  return {
    title: article.title,
    source: article.source,
    date: article.date,
    content: truncateToLength(article.content, state.selectedLength)
  };
}

// Truncate content to desired length
function truncateToLength(content, length) {
  const config = lengthConfig[length];
  if (!config) return content;
  
  const words = content.split(' ');
  const truncated = words.slice(0, config.words).join(' ');
  
  // Ensure it ends with proper punctuation
  if (truncated && !truncated.match(/[.!?]$/)) {
    return truncated + '.';
  }
  
  return truncated;
}

// Display article
function displayArticle(article) {
  state.currentArticle = article.content;
  state.articleMetadata = {
    title: article.title,
    source: article.source,
    date: formatDate(article.date)
  };

  // Update metadata display
  if (elements.articleTitle) {
    elements.articleTitle.textContent = article.title;
  }
  if (elements.articleSource) {
    elements.articleSource.textContent = article.source;
  }
  if (elements.articleDate) {
    elements.articleDate.textContent = formatDate(article.date);
  }

  resetTest();
  highlightText();
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Show loading state
function showLoading() {
  if (elements.articleDisplay) {
    elements.articleDisplay.innerHTML = '<div class="loading">Loading article...</div>';
  }
  if (elements.articleTitle) {
    elements.articleTitle.textContent = 'Loading article...';
  }
  if (elements.articleSource) {
    elements.articleSource.textContent = 'Loading...';
  }
  if (elements.articleDate) {
    elements.articleDate.textContent = 'Loading...';
  }
}

// Start typing test
function startTest() {
  if (state.isTestActive) return;
  
  state.isTestActive = true;
  state.startTime = Date.now();
  state.timer = setInterval(updateTimer, 100);
}

// Handle typing input
function handleTyping(e) {
  if (state.isTestComplete) return;
  
  if (!state.isTestActive) {
    startTest();
  }

  state.typedText = e.target.value;

  // Check if test is complete
  if (state.typedText.length >= state.currentArticle.length) {
    completeTest();
    return;
  }

  calculateStats();
  updateDisplay();
  updateProgress();
}

// Calculate typing statistics
function calculateStats() {
  if (!state.startTime) return;
  
  const elapsed = (Date.now() - state.startTime) / 1000 / 60; // minutes
  let correctChars = 0;
  let errors = 0;

  // Count correct characters and errors
  for (let i = 0; i < state.typedText.length; i++) {
    if (i < state.currentArticle.length && state.typedText[i] === state.currentArticle[i]) {
      correctChars++;
    } else {
      errors++;
    }
  }

  state.correctChars = correctChars;
  state.errors = errors;
  state.wpm = elapsed > 0 ? Math.max(0, Math.round((correctChars / 5) / elapsed)) : 0;
  state.accuracy = state.typedText.length > 0 ? Math.round((correctChars / state.typedText.length) * 100) : 100;
}

// Update display with current stats
function updateDisplay() {
  if (elements.wpmValue) {
    elements.wpmValue.textContent = state.wpm;
  }
  if (elements.accuracyValue) {
    elements.accuracyValue.textContent = `${state.accuracy}%`;
  }
  if (elements.errorsValue) {
    elements.errorsValue.textContent = state.errors;
  }
  highlightText();
}

// Highlight text based on typing progress
function highlightText() {
  if (!elements.articleDisplay || !state.currentArticle) return;
  
  const { currentArticle, typedText } = state;
  let html = '';

  for (let i = 0; i < currentArticle.length; i++) {
    const char = currentArticle[i];
    
    if (i < typedText.length) {
      // Character has been typed
      if (typedText[i] === char) {
        html += `<span class="char-correct">${char}</span>`;
      } else {
        html += `<span class="char-incorrect">${char}</span>`;
      }
    } else if (i === typedText.length) {
      // Current character to type
      html += `<span class="char-current">${char}</span>`;
    } else {
      // Characters not yet typed
      html += char;
    }
  }

  elements.articleDisplay.innerHTML = html;
}

// Update progress bar
function updateProgress() {
  if (!elements.progressFill || !state.currentArticle) return;
  
  const progress = Math.min(100, (state.typedText.length / state.currentArticle.length) * 100);
  elements.progressFill.style.width = `${progress}%`;
}

// Update timer display
function updateTimer() {
  if (!elements.timeValue || !state.startTime) return;
  
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  elements.timeValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Complete the test
function completeTest() {
  state.isTestComplete = true;
  state.isTestActive = false;
  clearInterval(state.timer);
  
  // Final calculation
  calculateStats();
  updateDisplay();
  updateProgress();
  
  if (elements.typingInput) {
    elements.typingInput.disabled = true;
    elements.typingInput.classList.add('typing-complete');
  }
  
  // Show results after a brief delay
  setTimeout(() => {
    showResults();
  }, 500);
}

// Show results modal
function showResults() {
  if (elements.finalWpm) elements.finalWpm.textContent = state.wpm;
  if (elements.finalAccuracy) elements.finalAccuracy.textContent = `${state.accuracy}%`;
  if (elements.finalTime && elements.timeValue) elements.finalTime.textContent = elements.timeValue.textContent;
  if (elements.finalErrors) elements.finalErrors.textContent = state.errors;
  if (elements.resultsModal) elements.resultsModal.classList.add('show');
}

// Hide results modal
function hideModal() {
  if (elements.resultsModal) {
    elements.resultsModal.classList.remove('show');
  }
}

// Reset test
function resetTest() {
  clearInterval(state.timer);
  
  state.typedText = '';
  state.startTime = null;
  state.isTestActive = false;
  state.isTestComplete = false;
  state.timer = null;
  state.errors = 0;
  state.correctChars = 0;
  state.wpm = 0;
  state.accuracy = 100;

  if (elements.typingInput) {
    elements.typingInput.value = '';
    elements.typingInput.disabled = false;
    elements.typingInput.classList.remove('typing-complete');
  }
  
  if (elements.wpmValue) elements.wpmValue.textContent = '0';
  if (elements.accuracyValue) elements.accuracyValue.textContent = '100%';
  if (elements.errorsValue) elements.errorsValue.textContent = '0';
  if (elements.timeValue) elements.timeValue.textContent = '0:00';
  if (elements.progressFill) elements.progressFill.style.width = '0%';
  
  highlightText();
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);