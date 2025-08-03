# Blog Website

A simple blog/news website that fetches and displays news articles using the NewsAPI. Built with HTML, CSS, and JavaScript.

## Screenshot
![Screenshot](https://via.placeholder.com/800x400.png?text=Blog+Website+Demo)


## Features
- Fetches latest news articles from NewsAPI
- Displays articles in a clean, responsive layout
- Easy configuration via `config.js`
- Custom styles in `styles.css`

## How It Works
1. The website loads and fetches news articles from NewsAPI using the API key in `config.js`.
2. Articles are displayed dynamically in the main content area.
3. Users can view headlines, summaries, and links to full articles.

All logic for fetching and rendering articles is handled in `newsapi.js` and `script.js`.

## Project Structure
```
config.js        # API key and configuration settings
index.html       # Main HTML file
newsapi.js       # Handles API requests to NewsAPI
script.js        # Main JavaScript logic for UI and interaction
styles.css       # Custom styles
```

## Setup
1. Clone or download this repository.
2. Get your NewsAPI key from [https://newsapi.org/](https://newsapi.org/).
3. Add your API key to `config.js`.
4. Open `index.html` in your browser.

## Customization
- **Change News Source:** Edit the source or query in `newsapi.js` to fetch different categories or sources.
- **Style:** Modify `styles.css` for custom colors, fonts, and layout.
- **Add Features:** Extend `script.js` to add search, filters, or pagination.

## Troubleshooting
- **No articles displayed:**
  - Check your API key in `config.js`.
  - Make sure you have internet access.
  - Inspect browser console for errors.
- **API limit reached:**
  - NewsAPI has request limits. Wait or upgrade your plan.


## Usage
- The website will automatically fetch and display the latest news articles.
- You can customize the appearance by editing `styles.css`.

## Credits
- [NewsAPI](https://newsapi.org/) for providing news data.
- Project by Ilyes.


## Dependencies
- No external dependencies required. All code runs in the browser.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
