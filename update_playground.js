const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Update header text
html = html.replace('Four projects. Each chosen for what it taught me, not for validation or outcomes.', 'Three projects. Each chosen for what it taught me, not for validation or outcomes.');

// Find projects
const getProject = (html, title) => {
    const startStr = `data-title="${title}"`;
    let startIdx = html.indexOf(startStr);
    if (startIdx === -1) return null;
    
    // Find beginning of the div
    while (startIdx > 0 && html.substring(startIdx - 18, startIdx) !== '<div class="projec') {
        startIdx--;
    }
    
    // Adjust start
    startIdx = html.lastIndexOf('<div class="project-row"', startIdx + 20);
    
    // Find end of the div
    let endIdx = html.indexOf('</div>\n\n', startIdx);
    if (endIdx === -1) {
        endIdx = html.indexOf('</div>\n                </div>', startIdx);
        if (endIdx !== -1) endIdx += 30; // close enough
    }
    
    // Try a more robust parser for the end of the project-row div
    let openDivs = 0;
    let i = startIdx;
    while(i < html.length) {
        if (html.substring(i, i+4) === '<div') openDivs++;
        if (html.substring(i, i+5) === '</div') openDivs--;
        if (openDivs === 0 && i > startIdx + 10) {
            return html.substring(startIdx, i+6);
        }
        i++;
    }
    return html.substring(startIdx, endIdx);
};

let nocturne = getProject(html, 'Nocturne');
let munim = getProject(html, 'Munim');
let awara = getProject(html, 'Awara');

// Re-index them
nocturne = nocturne.replace('Project 03 of 04', 'Project 01 of 03').replace('Project 03 of 04', 'Project 01 of 03');
munim = munim.replace('Project 04 of 04', 'Project 02 of 03').replace('Project 04 of 04', 'Project 02 of 03');
awara = awara.replace('Project 01 of 04', 'Project 03 of 03').replace('Project 01 of 04', 'Project 03 of 03');

const newProjectsList = `
${nocturne}

${munim}

${awara}
`;

const listStart = html.indexOf('<div class="projects-list">') + '<div class="projects-list">'.length;
const listEnd = html.indexOf('</section>', listStart);

// Let's grab the end of the last div to be safe
let realListEnd = html.lastIndexOf('</div>', listEnd) + 6;
// Actually just replace between <div class="projects-list"> and </div>\n        </section>
const searchEnd = html.indexOf('</div>\n        </section>');

html = html.substring(0, listStart) + '\n' + newProjectsList + '\n            ' + html.substring(searchEnd);

fs.writeFileSync('index.html', html);
console.log('playground index.html updated successfully.');
