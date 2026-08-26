import os

with open("src/components/Bento.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("React A Vite A Tailwind", "React — Vite — Tailwind")
content = content.replace("GSAP ScrollTrigger A Lenis", "GSAP ScrollTrigger — Lenis")
content = content.replace("Python A OpenCV", "Python — OpenCV")
content = content.replace("A deep dive", "— deep dive")
content = content.replace("Chapter 04 ?\" System Logic", "Chapter 04 — System Logic")
content = content.replace("Vision layer +' coordinates", "Vision layer → coordinates")
content = content.replace("Action layer +' GUI steps", "Action layer → GUI steps")
content = content.replace("State layer +' replay log", "State layer → replay log")
content = content.replace("Natural language +' action graph", "Natural language → action graph")
content = content.replace("Figma +\" code sync", "Figma → code sync")

with open("src/components/Bento.jsx", "w", encoding="utf-8") as f:
    f.write(content)
