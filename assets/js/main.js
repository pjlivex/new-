// Main JavaScript for Gaming Website

document.addEventListener('DOMContentLoaded', function() {
  let games = [];
  let filteredGames = [];
  let currentCategory = 'All';
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];

  // Load games data
  fetch('data/games.json')
    .then(response => response.json())
    .then(data => {
      games = data;
      filteredGames = games;
      displayGames(filteredGames);
      displayCategories();
      displayRecentlyPlayed();
    });

  // Display games
  function displayGames(gameList) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = '';
    gameList.forEach(game => {
      const gameCard = createGameCard(game);
      gameGrid.appendChild(gameCard);
    });
  }

  // Create game card
  function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${game.thumbnail}" alt="${game.name}" class="game-thumbnail" loading="lazy">
      <div class="game-info">
        <h3 class="game-title">${game.name}</h3>
        <p class="game-description">${game.description}</p>
        <div class="game-rating">⭐ ${game.rating}</div>
        <button class="favorite-btn" data-slug="${game.slug}">
          ${favorites.includes(game.slug) ? '❤️' : '🤍'}
        </button>
      </div>
    `;
    card.addEventListener('click', () => playGame(game.slug));
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(game.slug);
    });
    return card;
  }

  // Play game
  function playGame(slug) {
    // Add to recently played
    recentlyPlayed = recentlyPlayed.filter(s => s !== slug);
    recentlyPlayed.unshift(slug);
    if (recentlyPlayed.length > 5) recentlyPlayed = recentlyPlayed.slice(0, 5);
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    displayRecentlyPlayed();
    // Navigate to game
    window.location.href = `games/${slug}/`;
  }

  // Toggle favorite
  function toggleFavorite(slug) {
    if (favorites.includes(slug)) {
      favorites = favorites.filter(s => s !== slug);
    } else {
      favorites.push(slug);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayGames(filteredGames);
  }

  // Display categories
  function displayCategories() {
    const categories = ['All', ...new Set(games.map(g => g.category))];
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-btn ${cat === currentCategory ? 'active' : ''}`;
      btn.textContent = cat;
      btn.addEventListener('click', () => filterByCategory(cat));
      categoriesContainer.appendChild(btn);
    });
  }

  // Filter by category
  function filterByCategory(category) {
    currentCategory = category;
    displayCategories();
    if (category === 'All') {
      filteredGames = games;
    } else {
      filteredGames = games.filter(g => g.category === category);
    }
    displayGames(filteredGames);
  }

  // Search
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    filteredGames = games.filter(g =>
      g.name.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query)
    );
    if (currentCategory !== 'All') {
      filteredGames = filteredGames.filter(g => g.category === currentCategory);
    }
    displayGames(filteredGames);
  });

  // Display recently played
  function displayRecentlyPlayed() {
    const recentlyPlayedContainer = document.getElementById('recently-played');
    recentlyPlayedContainer.innerHTML = '<h3>Recently Played</h3>';
    const recentGames = recentlyPlayed.map(slug => games.find(g => g.slug === slug)).filter(Boolean);
    if (recentGames.length === 0) {
      recentlyPlayedContainer.innerHTML += '<p>No recently played games.</p>';
      return;
    }
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    recentGames.forEach(game => {
      const card = createGameCard(game);
      grid.appendChild(card);
    });
    recentlyPlayedContainer.appendChild(grid);
  }

  // Dark/Light mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.classList.toggle('light-mode', savedTheme === 'light');
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', function() {
    body.classList.toggle('light-mode');
    const newTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  });

  // Add light mode styles
  const style = document.createElement('style');
  style.textContent = `
    .light-mode {
      --bg-color: #f0f0f0;
      --card-bg: rgba(0, 0, 0, 0.05);
      --text-color: #000000;
      --text-secondary: #666666;
      --border-color: rgba(0, 0, 0, 0.1);
      --glass-bg: rgba(0, 0, 0, 0.05);
      --glass-border: rgba(0, 0, 0, 0.1);
    }
    .light-mode .game-card:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  `;
  document.head.appendChild(style);
});