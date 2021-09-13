const md = require('markdown-it')({
    html: true, // Enable HTML tags in source
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links
});
const emoji = require('markdown-it-emoji');
const fs = require('fs');
const { DOMParser } = require('xmldom');
const axios = require('axios');

const websiteUrl = 'https://vladimirgorej.com/';
const twitterUrl = 'https://www.twitter.com/vladimirgorej';
const linkedInUrl = 'https://www.linkedin.com/in/vladimirgorej';
const mediumUrl = 'https://medium.com/@vladimirgorej';
const devToUrl = 'https://dev.to/char0n';
const blogPostLimit = 5;
const badgeHeight = "25";

md.use(emoji);

(async () => {
    const blogPosts = await loadBlogPosts();
    const twitterImage = `[![github-readme-twitter](https://github-readme-twitter-gazf.vercel.app/api?id=vladimirgorej&layout=wide)](${twitterUrl})`;
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
  ## Latest Tweets\n
  ${twitterImage}\n
  [:arrow_right: More tweets](${twitterUrl})
  \n\n
  ## GitHub Stats\n
  ![GitHub Stats](https://github-readme-stats.vercel.app/api?username=char0n&show_icons=true)`;

    const result = md.render(text);

    fs.writeFile("README.md", result, function (err) {
        if (err) return console.log(err);
        console.log(`${result} > README.md`);
    });
})();

async function loadBlogPosts() {
    const { data } = await axios.get(`${websiteUrl}feed.xml`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 ',
        },
    });
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml')
    const allXmlEntries = Array.from(xmlDoc.getElementsByTagName('entry'));
    const xmlEntries = allXmlEntries.slice(0, 5);
    // gets a single child element by tag name
    const t = (entry, tname) => entry.getElementsByTagName(tname)[0];
    // get date from an entry element
    const dateFormat = entry => new Date(t(entry, 'published').textContent).toDateString();
    const articles = xmlEntries.map(entry => {
       const imageUrl = t(entry, 'media:thumbnail').getAttribute('url');
       const date = dateFormat(entry);
       const title = t(entry, 'title').textContent;
       const url = t(entry, 'content').getAttribute('xml:base')

       return `<a href="${url}" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="${imageUrl}"></a>

[${title}](${url})
\`\`\`
${date}
\`\`\`

---\n`
    });

    return `
  ${articles.join('')}\n
  [:arrow_right: More blog posts](${websiteUrl}blog/)
  `;
}