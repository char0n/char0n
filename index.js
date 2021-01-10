const md = require("markdown-it")({
    html: true, // Enable HTML tags in source
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links
});
const emoji = require("markdown-it-emoji");
const fs = require("fs");
const cheerio = require('cheerio');
const axios = require('axios');

const feedUrl = "https://www.mokkapps.de/rss.xml";
const websiteUrl = "http://vladimirgorej.com/";
const twitterUrl = "https://www.twitter.com/vladimirgorej";
const linkedInUrl = "https://www.linkedin.com/in/vladimirgorej";
const mediumUrl = "https://medium.com/@vladimirgorej";
const devToUrl = "https://dev.to/char0n";
const blogPostLimit = 5;
const badgeHeight = "25";

md.use(emoji);

(async () => {
    let blogPosts = "";
    try {
        blogPosts = await loadBlogPosts();
    } catch (e) {
        console.error(`Failed to load blog posts from ${websiteUrl}`, e);
    }

    const twitterImage = `[<img src="https://github.com/char0n/char0n/blob/master/tweet.png" width="600">](${twitterUrl})`;
    const twitterBadge = `[<img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" height=${badgeHeight}>](${twitterUrl})`;
    const linkedInBadge = `[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" height=${badgeHeight}>](${linkedInUrl})`;
    const mediumBadge = `[<img src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" height=${badgeHeight}>](${mediumUrl})`;
    const devToBadge = `[<img src="https://img.shields.io/badge/DEV.TO-%230A0A0A.svg?&style=for-the-badge&logo=dev-dot-to&logoColor=white" height=${badgeHeight}>](${devToUrl})`;

    const githubSponsors = `<a href="https://github.com/sponsors/char0n" target="_blank" rel="noreferrer nofollow">
      Sponsor me through GitHub
    </a>`;

    const text = `# Hi :wave:\n\n
  ${twitterBadge} ${linkedInBadge} ${mediumBadge} ${devToBadge}\n\n
  [:arrow_right: Check out my website](${websiteUrl})\n\n
  ${githubSponsors}\n\n
  ## Latest Blog Posts\n
  ${blogPosts}\n
  ## Last Tweet\n
  ${twitterImage}\n\n
  ## GitHub Stats\n
  ![GitHub Stats](https://github-readme-stats.vercel.app/api?username=char0n&show_icons=true)`;

    const result = md.render(text);

    fs.writeFile("README.md", result, function (err) {
        if (err) return console.log(err);
        console.log(`${result} > README.md`);
    });
})();

async function loadBlogPosts() {
    const { data } = await axios.get('https://www.linkedin.com/today/author/vladimirgorej?trk=author-info__article-link', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280',
        },
    });
    let links = "";
    const $ = cheerio.load(data);
    $('.article-card').slice(0, 5).each(function() {
       const card = $(this);
       const imageUrl = card.find('.article-card__image').first().attr('data-delayed-url');
       const title = card.find('.article-card__image').first().attr('alt');
       const date = card.find('.article-card__meta-info .article-card__meta-info-item').first().text();
       const url = `https://www.linkedin.com${card.find('.article-card__title--link').first().attr('href')}`;

       links += `<a href="${url}" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="${imageUrl}"></a>

[${title}](${url})
\`\`\`
${date}
\`\`\`

---\n`
    });

    return `
  ${links}\n
  [:arrow_right: More blog posts](https://www.linkedin.com/today/author/vladimirgorej?trk=author-info__article-link&utm_source=juniorguru&utm_medium=content&utm_campaign=juniorguru)
  `;
}