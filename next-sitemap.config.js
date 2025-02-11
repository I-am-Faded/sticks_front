/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://sticks-front.vercel.app', // URL твоего сайта
    generateRobotsTxt: true, // Создаст robots.txt автоматически
    generateIndexSitemap: false, // Отключаем sitemap-0.xml
  };

  module.exports = {
    async headers() {
      return [
        {
          source: "/sitemap.xml",
          headers: [
            {
              key: "Cache-Control",
              value: "no-cache, no-store, must-revalidate",
            },
            {
              key: "Pragma",
              value: "no-cache",
            },
            {
              key: "Expires",
              value: "0",
            },
          ],
        },
      ];
    },
  };
  