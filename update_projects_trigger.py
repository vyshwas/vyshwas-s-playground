import os

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the fromTo for proj-reveal so it doesn't get permanently stuck
old_reveal = """      gsap.fromTo(row.current.querySelectorAll('.proj-reveal'), {
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

new_reveal = """      gsap.fromTo(row.current.querySelectorAll('.proj-reveal'), {
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
          start: 'top 95%', // more forgiving
          end: 'top 40%',
          toggleActions: 'play none none reverse', // play when entering, reverse when leaving
        },
      })"""

content = content.replace(old_reveal, new_reveal)

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Projects.jsx scroll triggers updated.")
