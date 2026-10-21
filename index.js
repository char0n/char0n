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
    const about = `Vladimír Gorej is a Prague-based **Senior Full-Stack Engineer** with 17+ years of experience, the last seven specialized in developer tooling for the API specification ecosystem: **OpenAPI**, **AsyncAPI**, **Arazzo**, and **JSON Schema**. Over the years, he has worked as Technical Team Lead at Oracle, Principal Software Engineer at Apiary, and Senior Open Source Engineer at SmartBear, along with other senior engineering and leadership roles at Ubiquiti Networks, SecurityScorecard, and Jentic. Today he is building [SpecLynx](https://speclynx.com/), the open, local-first toolchain for API specifications that he co-founded. Active in the Open Source community for more than fifteen years, he is a [maintainer of the AsyncAPI specification](https://github.com/asyncapi/spec), spent five years as a maintainer of [Swagger tools](https://swagger.io), and is an alumni member of the [GitHub Stars program](https://stars.github.com/alumni/#:~:text=char0n). He holds all Open Source Best Practices certifications awarded by The Linux Foundation, and believes an API spec is only worth as much as the tooling around it: his work is about making APIs usable by developers and AI agents alike.`;
    const specLynx = `<br><div><h2>SpecLynx</h2><p><a href="https://speclynx.com/" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://vladimirgorej.com/assets/img/speclynx-logo.webp"></a></p><p>Vladimír is a <strong>co-founder</strong> of <a href="https://speclynx.com/">SpecLynx - One toolchain for every API spec</a>. One semantic structure. Every API spec. SpecLynx parses, validates, transforms, and lints OpenAPI, AsyncAPI, Arazzo, Overlay, and JSON Schema through one shared semantic structure. It ships a browser-based Editor, OpenAPI Toolkit for VS Code, CLI, Language Service, and ApiDOM. Local-first, always: runs offline, no accounts, no telemetry, open source under Apache 2.0.</p><br><br></div>`;
    const useArazzo = `<br><div><h2>UseArazzo</h2><p><a href="https://usearazzo.com/" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://vladimirgorej.com/assets/img/usearazzo-logo.webp"></a></p><p>Vladimír is a <strong>co-founder</strong> of <a href="https://usearazzo.com/">UseArazzo - The foundational operating system for Arazzo API workflows</a>. UseArazzo is a JavaScript/TypeScript toolkit for Arazzo, the OpenAPI Initiative specification for multi-step API workflows. It parses, resolves, and validates Arazzo Documents against the specification, and runs workflows against live APIs with a step-by-step trace in run order. Open source under Apache-2.0 on <a href="https://github.com/usearazzo">GitHub</a>.</p><br><br></div>`;
    const swaggerExpert = '<br><div><h2>SwaggerExpert</h2><p><a href="https://swaggerexpert.com/" target="_blank" rel="noreferrer nofollow"><img align="left" width="100" height="100" src="https://vladimirgorej.com/assets/img/swagger-expert-logo.webp"></a></p><p>Vladimír is a <strong>founder</strong> of <a href="https://swaggerexpert.com/">SwaggerExpert</a>. SwaggerExpert is a community dedicated to extensions and libraries enhancing the Swagger/OpenAPI ecosystem. Its core libraries are the <a href="https://github.com/swaggerexpert/arazzo-runtime-expression">Arazzo Runtime Expressions</a> and <a href="https://github.com/swaggerexpert/arazzo-criterion">Arazzo Criterion Object</a> parsers, validators and evaluators, the <a href="https://github.com/swaggerexpert/jsonpath">RFC 9535 JSONPath</a> parser, validator and evaluator, and the <a href="https://github.com/swaggerexpert/json-pointer">RFC 6901 JSON Pointer</a> implementation. It also maintains OpenAPI path and server URL templating parsers, the swagger-editor-validate GitHub Action, an RFC 6265 compliant cookie parser, and more.</p><br><br></div>';
    const fromPacketsToPixels = `<h2>Featured Series</h2><p><a href="https://vladimirgorej.com/from-packets-to-pixels/" target="_blank" rel="noreferrer nofollow"><img width="100%" src="https://vladimirgorej.com/assets/img/series/from-packets-to-pixels.webp" alt="From packets to pixels: a hands-on series in four parts"></a></p><p><a href="https://vladimirgorej.com/from-packets-to-pixels/"><strong>From packets to pixels</strong></a> - the web, rebuilt from first principles. Most engineers inherit their mental model of the stack beneath their code; this series verifies it instead, one layer at a time: the network and protocols first, then HTML, CSS, and JavaScript. Every part ends its sections with hands-on exercises that need nothing more than a terminal and a browser.</p>`;
    const githubStars = `<div align="center"><div><a href="https://stars.github.com/alumni/#:~:text=char0n"><img width="13%" height="13%" src="https://user-images.githubusercontent.com/193286/186345071-d2c44d8e-646e-45d4-bceb-5610f089f119.png" alt="Alumni GitHub Star program member"></a></div><p><a href="https://github.com/sponsors/char0n" target="_blank" rel="noreferrer nofollow">❤️ Sponsor me through GitHub</a></p></div>`;
    const text = `# Hi :wave:\n\n
  ${websiteBadge} ${githubStarBadge} ${twitterBadge} ${linkedInBadge} ${mediumBadge} ${devToBadge}\n\n
  ${about}
  ${specLynx}
  ${useArazzo}
  ${swaggerExpert}
  ${githubStars}\n\n
  ${fromPacketsToPixels}\n\n
  ## Latest Blog Posts\n
  ${blogPosts}\n
  \n\n
  ## GitHub Stats\n
  <img src="https://github-readme-stats-six-wheat-61.vercel.app/api?username=char0n&show_icons=true&hide_border=true&count_private=true&include_all_commits=true" alt="GitHub stats" height="180em"> <img src="https://github-readme-stats-six-wheat-61.vercel.app/api/top-langs/?username=char0n&show_icons=true&hide_border=true&layout=compact&langs_count=8" alt="GitHub most used languages" height="180em">`;

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
