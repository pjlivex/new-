# Retro Games Hub

A modern, scalable browser-based gaming website featuring 15+ classic HTML5 games with leaderboards, favorites, and responsive design.

## Features

- 15 fully functional HTML5 games (Snake, Tetris, Pong, Breakout, Space Invaders, Flappy Bird, 2048, Tic Tac Toe, Memory Game, Frogger, Pacman, Asteroids, Minesweeper, Connect Four, Chess)
- Responsive design with dark theme and neon accents
- Game categories (Action, Racing, Puzzle, Arcade, Multiplayer)
- Search functionality
- Recently played and favorites system
- Leaderboards per game (stored in localStorage)
- Fullscreen mode for games
- Dark/Light mode toggle
- SEO optimized
- AdSense-friendly ad placements

## Project Structure

```
/
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── ads.txt                 # AdSense verification
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Main JavaScript
│   └── images/             # Game thumbnails and icons
├── data/
│   └── games.json          # Game metadata
└── games/
    ├── snake/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    └── ...                 # Other games
```

## Deployment Instructions

### Option 1: Netlify (Recommended)

1. Go to [Netlify](https://netlify.com) and sign up/login
2. Click "Deploy manually" or "Sites"
3. Drag and drop the `gaming-website.zip` file (located at `/workspaces/gaming-website.zip`) or upload the entire project folder
4. Netlify will deploy the site automatically
5. Your site will be live at a URL like `https://amazing-site-name.netlify.app`

### Option 2: Vercel

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "Import Project"
3. Upload the ZIP file or connect your Git repository
4. Vercel will deploy the site automatically

### Option 3: GitHub Pages

1. Create a new GitHub repository
2. Upload all project files to the repository
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose `main` branch
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init` (select Hosting)
4. Deploy: `firebase deploy`

## Adding New Games

1. Create a new folder in `games/` with the game slug name
2. Add `index.html`, `script.js`, and `style.css` files
3. Add game metadata to `data/games.json`
4. Add a thumbnail SVG to `assets/images/`
5. Implement leaderboard saving in the game script

## Backend Integration (Optional)

For persistent leaderboards across devices, integrate Firebase:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore database
3. Add Firebase config to games' scripts
4. Replace localStorage leaderboard with Firestore calls

## Customization

- Modify colors in `assets/css/style.css` (CSS variables)
- Update branding in HTML files
- Add more games following the existing structure
- Integrate real ads by replacing ad placeholders with AdSense code

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Canvas API for games
- Local Storage for data persistence

## License

This project is for educational purposes. Ensure compliance with copyright laws when adding new games or assets.