const markdownit = require('markdown-it');
const md = markdownit({
    html: true, // Enable HTML tags in source
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links
});
const { full: emoji } = require('markdown-it-emoji');
const fs = require('fs');
const { DOMParser } = require('xmldom');
const axios = require('axios');

const websiteUrl = 'https://vladimirgorej.com/';
const twitterUrl = 'https://www.twitter.com/vladimirgorej';
const linkedInUrl = 'https://www.linkedin.com/in/vladimirgorej';
const mediumUrl = 'https://medium.com/@vladimirgorej';
const devToUrl = 'https://dev.to/char0n';
const githubStarUrl = 'https://stars.github.com/alumni/#:~:text=char0n';
const blogPostLimit = 5;
const badgeHeight = "25";

md.use(emoji);

(async () => {
    const blogPosts = await loadBlogPosts();
    const websiteBadge = `[<img src="https://img.shields.io/badge/vladimirgorej.com-%230A0A0A.svg?&style=for-the-badge&logo=dev-dot-to&logoColor=white" height=${badgeHeight}>](${websiteUrl})`;
    const githubStarBadge = `[<img src="https://img.shields.io/badge/Alumni%20GitHub%20Star-%230A0A0A.svg?&style=for-the-badge&logo=github&logoColor=#D66C58" height=${badgeHeight}>](${githubStarUrl})`;
    const twitterBadge = `[<img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" height=${badgeHeight}>](${twitterUrl})`;
    const linkedInBadge = `[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" height=${badgeHeight}>](${linkedInUrl})`;
    const mediumBadge = `[<img src="https://img.shields.io/badge/medium-%2312100E.svg?&style=for-the-badge&logo=medium&logoColor=white" height=${badgeHeight}>](${mediumUrl})`;
    const devToBadge = `[<img src="https://img.shields.io/badge/DEV.TO-%230A0A0A.svg?&style=for-the-badge&logo=dev-dot-to&logoColor=white" height=${badgeHeight}>](${devToUrl})`;
    const about = `Vladimír Gorej is a Prague-based **software engineer** passionate about software/code quality, Functional and Reactive programming. Vladimír is formerly Technical Team Lead of Oracle, Principal Software Engineer at Apiary and held other senior engineering and leading roles in international companies like Ubiquiti Networks or SecurityScorecard. He's been active in the Open Source community for the last ten years and currently utilizes his experience in this field as an Open Source Software Engineer at SmartBear. Vladimír holds all OpenSource Best Practices certifications awarded by The Linux Foundation. Additionally, his expertise is further acknowledged as an alumni member of the [GitHub Stars program](https://stars.github.com/alumni/#:~:text=char0n). He also plays a pivotal role in shaping the future of asynchronous APIs as a [maintainer of AsyncAPI specification](https://github.com/asyncapi/spec). His favorite programming languages include **JavaScript**, **Python**, and **Elixir**.`;
    // const swaggerExpert = '<br><div><h2>SwaggerExpert</h2><p><a href="https://swaggerexpert.com/" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://vladimirgorej.com/assets/img/swagger-expert-logo.webp"></a></p><p>Vladimír is a <strong>founder</strong> of <a href="https://swaggerexpert.com/">SwaggerExpert</a>. SwaggerExpert is a go-to source for expert guidance, comprehensive solutions for Swagger Open Source tools, and a vibrant community dedicated to developing extensions and enhancing the Swagger ecosystem. With more than four years of experience as a maintainer of Swagger tools, he is dedicated to helping developers and organizations effectively utilize and master Swagger for their API development needs.</p><br ></div>'
    const swaggerExpert = '<br><div><h2>SwaggerExpert</h2><p><a href="https://swaggerexpert.com/" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://vladimirgorej.com/assets/img/swagger-expert-logo.webp"></a></p><p>Vladimír is a <strong>founder</strong> of <a href="https://swaggerexpert.com/">SwaggerExpert</a>. SwaggerExpert is a community dedicated to developing extensions and libraries enhancing the Swagger ecosystem.</p><br><br></div>'
    const githubStars = `<div align="center"><div><a href="https://stars.github.com/alumni/#:~:text=char0n"><img width="13%" height="13%" src="https://user-images.githubusercontent.com/193286/186345071-d2c44d8e-646e-45d4-bceb-5610f089f119.png" alt="Alumni GitHub Star program member"></a></div><p><a href="https://github.com/sponsors/char0n" target="_blank" rel="noreferrer nofollow">❤️ Sponsor me through GitHub</a></p></div>`;
    const text = `# Hi :wave:\n\n
  ${websiteBadge} ${githubStarBadge} ${twitterBadge} ${linkedInBadge} ${mediumBadge} ${devToBadge}\n\n
  ${about}
  ${swaggerExpert}
  ${githubStars}\n\n
  ## Latest Blog Posts\n
  ${blogPosts}\n
  \n\n
  ## GitHub Stats\n
  <img src="https://github-readme-stats.vercel.app/api?username=char0n&show_icons=true&hide_border=true&count_private=true&include_all_commits=true" alt="GitHub stats" height="180em"> <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=char0n&show_icons=true&hide_border=true&layout=compact&langs_count=8" alt="GitHub most used languages" height="180em">`;

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