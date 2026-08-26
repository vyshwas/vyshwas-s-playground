import os

# 1. Update FooterExit.jsx
with open("src/components/FooterExit.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("{ label: 'LinkedIn', href: '#' }", "{ label: 'LinkedIn', href: 'https://linkedin.com/in/vyshwasmehta' }")
content = content.replace("{ label: 'Twitter', href: '#' }", "{ label: 'Twitter', href: 'https://twitter.com/vyshwas' }")
content = content.replace(
    "{ label: 'Twitter', href: 'https://twitter.com/vyshwas' },",
    "{ label: 'Twitter', href: 'https://twitter.com/vyshwas' },\n            { label: 'Email', href: 'mailto:hello@vyshwas.design' },"
)

with open("src/components/FooterExit.jsx", "w", encoding="utf-8") as f:
    f.write(content)

# 2. Update Nav.jsx garbled arrow
with open("src/components/Nav.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("Portfolio +-", "Portfolio ↗")

with open("src/components/Nav.jsx", "w", encoding="utf-8") as f:
    f.write(content)

# 3. Update Projects.jsx
with open("src/components/Projects.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("link: '#'", "link: 'https://vyshwas.github.io/'")

with open("src/components/Projects.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated links and added email")
