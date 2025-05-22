/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://generatoropisow.pl', // ← podmień jeśli masz inną domenę
    generateRobotsTxt: true, // wygeneruje też public/robots.txt
    changefreq: 'weekly',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: [], // nie chcesz indeksować tych stron
  };
  