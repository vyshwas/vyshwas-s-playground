import os

with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("data-cursor=\"magnetic\">o </button>", "data-cursor=\"magnetic\">✕</button>")
content = content.replace("View Case Study <span className=\"text-amber\">+'</span>", "View Case Study <span className=\"text-amber\">→</span>")
content = content.replace("[ Chapter 03 ?\" Selected Works ]", "[ Chapter 03 — Selected Works ]")

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(content)
