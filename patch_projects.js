const fs = require('fs');

let projects = fs.readFileSync('src/components/Projects.jsx', 'utf8');

projects = projects.replace(
  "gsap.set(mask, { scaleX: 0, transformOrigin: side === 1 ? 'left' : 'right' })",
  "gsap.set(mask, { scaleX: 1, transformOrigin: side === 1 ? 'right' : 'left' })"
);

projects = projects.replace(
  /gsap\.to\(mask, \{\s*scaleX:\s*1,/g,
  "gsap.to(mask, {\n        scaleX: 0,"
);

projects = projects.replace(
  /gsap\.from\(row\.current\.querySelectorAll\('\.proj-reveal'\), \{[\s\S]*?\}\)/,
  `gsap.fromTo(row.current.querySelectorAll('.proj-reveal'), {
        y: 44,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row.current,
          start: 'top 85%',
          once: true,
        },
      })`
);

fs.writeFileSync('src/components/Projects.jsx', projects);
console.log("Projects.jsx patched.");
