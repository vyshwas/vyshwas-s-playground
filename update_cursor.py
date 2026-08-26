import os

with open("src/components/MagneticCursor.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make the inner cursor solid black
content = content.replace(
    "border: '2px solid #121212', mixBlendMode: 'normal'",
    "border: '2px solid #000000', background: '#000000', mixBlendMode: 'normal'"
)

# Update the follower just in case, make it a bit darker outline
content = content.replace(
    "border: '1px solid rgba(18,18,18,0.4)', mixBlendMode: 'normal'",
    "border: '1.5px solid rgba(0,0,0,0.5)', mixBlendMode: 'normal'"
)

# Update the jsx styles
content = content.replace(
    ".is-hover { width: 28px; height: 28px; border-color: #121212; }",
    ".is-hover { width: 24px; height: 24px; border-color: #000000; background: #000000; }"
)
content = content.replace(
    ".is-hover + * { width: 56px; height: 56px; border-color: rgba(18,18,18,0.3); }",
    ".is-hover + * { width: 48px; height: 48px; border-color: rgba(0,0,0,0.3); }"
)

content = content.replace(
    ".is-magnetic { width: 20px; height: 20px; border-color: #121212; background: rgba(18,18,18,0.1); }",
    ".is-magnetic { width: 20px; height: 20px; border-color: #000000; background: #000000; opacity: 0.8; }"
)

content = content.replace(
    ".is-text { width: 40px; height: 4px; border-radius: 2px; border-color: #121212; }",
    ".is-text { width: 40px; height: 4px; border-radius: 2px; border-color: #000000; background: #000000; }"
)

content = content.replace(
    ".is-drag { width: 32px; height: 32px; border-color: #121212; border-style: dashed; }",
    ".is-drag { width: 32px; height: 32px; border-color: #000000; border-style: dashed; background: transparent; }"
)


with open("src/components/MagneticCursor.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated cursor to solid deep black")
