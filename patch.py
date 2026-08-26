import os

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    projects = f.read()

projects = projects.replace(
    "gsap.set(mask, { scaleX: 0, transformOrigin: side === 1 ? 'left' : 'right' })",
    "gsap.set(mask, { scaleX: 1, transformOrigin: side === 1 ? 'right' : 'left' })"
)

projects = projects.replace(
    "gsap.to(mask, {\n        scaleX: 1,",
    "gsap.to(mask, {\n        scaleX: 0,"
)

old_text_anim = """      gsap.from(row.current.querySelectorAll('.proj-reveal'), {
        y: 44,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row.current,
          start: 'top 72%',
          once: true,
        },
      })"""

new_text_anim = """      gsap.fromTo(row.current.querySelectorAll('.proj-reveal'), {
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
      })"""

projects = projects.replace(old_text_anim, new_text_anim)

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(projects)
print("Projects patched.")
