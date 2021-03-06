const md = require("markdown-it")({
    html: true, // Enable HTML tags in source
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links
});
const emoji = require("markdown-it-emoji");
const fs = require("fs");
const cheerio = require('cheerio');
const axios = require('axios');

const websiteUrl = "https://vladimirgorej.com/";
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
        blogPosts = `<p><a href="https://www.linkedin.com/pulse/how-validate-openapi-definitions-swagger-editor-using-vladim%C3%ADr-gorej?trk=portfolio_article-card_title" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://media-exp1.licdn.com/dms/image/C4D12AQHW41125fKGbg/article-cover_image-shrink_600_2000/0/1615132805293?e=1626307200&v=beta&t=okBFvXMFpp3Hg_wLjmIb3ZIWP7ChFdN4BizvQOkcue4"></a></p>
                        <p><a href="https://www.linkedin.com/pulse/how-validate-openapi-definitions-swagger-editor-using-vladim%C3%ADr-gorej?trk=portfolio_article-card_title">How to validate OpenAPI definitions in Swagger Editor using GitHub Actions</a></p>
                        <pre><code>March 7, 2021
                        </code></pre>
                        <hr>
                        <p><a href="https://www.linkedin.com/pulse/how-swagger-adjust-can-help-you-build-extensible-reactredux-gorej?trk=portfolio_article-card_title" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://media-exp1.licdn.com/dms/image/C4D12AQHK_s_FE8kVwQ/article-cover_image-shrink_600_2000/0/1614265471653?e=1626307200&v=beta&t=63eWidIz2mJcmTv89S_IXU7ev9W7jIvihs9CeIDERZg"></a></p>
                        <p><a href="https://www.linkedin.com/pulse/how-swagger-adjust-can-help-you-build-extensible-reactredux-gorej?trk=portfolio_article-card_title">How Swagger Adjust can help you build extensible React+Redux apps</a></p>
                        <pre><code>February 25, 2021
                        </code></pre>
                        <hr>
                        <p><a href="https://www.linkedin.com/pulse/how-keep-your-npm-dependencies-up-to-date-without-wasting-gorej?trk=portfolio_article-card_title" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://media-exp1.licdn.com/dms/image/C4D12AQHJqeVq0GQCXg/article-cover_image-shrink_600_2000/0/1605983118490?e=1626307200&v=beta&t=icKoXnfC0WH1_f409Pgm6dY85vdky8oLuzIZOq7cgcs"></a></p>
                        <p><a href="https://www.linkedin.com/pulse/how-keep-your-npm-dependencies-up-to-date-without-wasting-gorej?trk=portfolio_article-card_title">How to keep your npm dependencies up-to-date without wasting your time </a></p>
                        <pre><code>December 15, 2020
                        </code></pre>
                        <hr>
                        <p><a href="https://www.linkedin.com/pulse/things-i-wish-had-known-when-started-javascript-monorepo-gorej?trk=portfolio_article-card_title" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://media-exp1.licdn.com/dms/image/C4D12AQFsMUk8jSHJeg/article-cover_image-shrink_600_2000/0/1599334464464?e=1626307200&v=beta&t=poUjueaMK8n31VH8iCMyUmj7b4MeuzMLAOmAV_gzWRM"></a></p>
                        <p><a href="https://www.linkedin.com/pulse/things-i-wish-had-known-when-started-javascript-monorepo-gorej?trk=portfolio_article-card_title">Things I wish I had known when I started JavaScript monorepo with Lerna</a></p>
                        <pre><code>September 7, 2020
                        </code></pre>
                        <hr>
                        <p><a href="https://www.linkedin.com/pulse/how-use-npm-audit-continuous-integration-3-simple-steps-gorej?trk=portfolio_article-card_title" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://media-exp1.licdn.com/dms/image/C4D12AQF89tAznrEA0Q/article-cover_image-shrink_600_2000/0/1593872507953?e=1626307200&v=beta&t=--WT1j82YxJ3TwPYpo-7LqLxcLudSVuJIJ7Pq-czIA4"></a></p>
                        <p><a href="https://www.linkedin.com/pulse/how-use-npm-audit-continuous-integration-3-simple-steps-gorej?trk=portfolio_article-card_title">How to use npm audit with Continuous Integration in 3 simple steps</a></p>
                        <pre><code>July 6, 2020
                        </code></pre>`;
    }

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
    const { data } = await axios.get('https://www.linkedin.com/today/author/vladimirgorej?trk=author-info__article-link', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 ',
        },
    });
    let links = "";
    const $ = cheerio.load(data);
    $('.article-card').slice(0, blogPostLimit).each(function() {
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
  [:arrow_right: More blog posts](https://www.linkedin.com/today/author/vladimirgorej?trk=author-info__article-link)
  `;
}