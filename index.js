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
const githubStarUrl = 'https://stars.github.com/profiles/char0n/';
const blogPostLimit = 5;
const badgeHeight = "25";

md.use(emoji);

(async () => {
    const blogPosts = await loadBlogPosts();
    const twitterImage = `[![github-readme-twitter](https://github-readme-twitter-gazf.vercel.app/api?id=vladimirgorej&layout=wide&show_border=off)](${twitterUrl})`;
    const websiteBadge = `[<img src="https://img.shields.io/badge/vladimirgorej.com-%230A0A0A.svg?&style=for-the-badge&logo=dev-dot-to&logoColor=white" height=${badgeHeight}>](${websiteUrl})`;
    const twitterBadge = `[<img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" height=${badgeHeight}>](${twitterUrl})`;
    const linkedInBadge = `[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" height=${badgeHeight}>](${linkedInUrl})`;
    const mediumBadge = `[<img src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" height=${badgeHeight}>](${mediumUrl})`;
    const devToBadge = `[<img src="https://img.shields.io/badge/DEV.TO-%230A0A0A.svg?&style=for-the-badge&logo=dev-dot-to&logoColor=white" height=${badgeHeight}>](${devToUrl})`;
    const about = `Vladimír Gorej is a Prague-based **software engineer** passionate about software/code quality, Functional and Reactive programming. Vladimír is formerly Technical Team Lead of Oracle, Principal Software Engineer at Apiary and held other senior engineering and leading roles in international companies like Ubiquiti Networks or SecurityScorecard. He's been active in the Open Source community for the last ten years and currently utilizes his experience in this field as an Open Source Software Engineer at SmartBear. Vladimír holds all OpenSource Best Practices certifications awarded by The Linux Foundation and is a member of the [GitHub Stars program](${githubStarUrl}).      His favorite programming languages include **JavaScript**, **Python**, and **Elixir**.`;
    const githubSponsors = `<a href="https://github.com/sponsors/char0n" target="_blank" rel="noreferrer nofollow">:heart: Sponsor me through GitHub</a>`;
    const githubStars = `[<img width="13%" height="13%" src="https://github.com/GitHub-Stars/program-details/raw/main/Assets/Logos/github-stars-logo_Color__on-white.png" alt="GitHub Star programme member">](${githubStarUrl})`;
    const text = `# Hi :wave:\n\n
  ${websiteBadge} ${twitterBadge} ${linkedInBadge} ${mediumBadge} ${devToBadge}\n\n
  ${about}
  ${githubStars}
  ${githubSponsors}\n\n
  ## Latest Blog Posts\n
  ${blogPosts}\n
  ## Latest Tweets\n
  ${twitterImage}\n
  [:arrow_right: More tweets](${twitterUrl})
  \n\n
  ## GitHub Stats\n
  <img src="https://github-readme-stats.vercel.app/api?username=char0n&show_icons=true&hide_border=true&count_private=true&include_all_commits=true" alt="GitHub stats" height="180em">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=char0n&show_icons=true&hide_border=true&layout=compact&langs_count=8" alt="GitHub most used languages" height="180em">`;

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
    const xmlEntries = Array.from(xmlDoc.getElementsByTagName('entry')).slice(0, blogPostLimit);
    // gets a single child element by tag name
    const t = (entry, tname) => entry.getElementsByTagName(tname)[0];
    // get date from an entry element
    const dateFormat = entry => new Date(t(entry, 'published').textContent).toDateString();
    const blogPosts = xmlEntries.map(entry => {
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
  ${blogPosts.join('')}\n
  [:arrow_right: More blog posts](${websiteUrl}blog/)
  `;
}