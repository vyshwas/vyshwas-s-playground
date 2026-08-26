import os

with open("src/components/Bento.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("min-h-[280px] md:min-h-[320px]", "min-h-[340px] md:min-h-[420px]")
content = content.replace("overflow-hidden rounded-lg border", "rounded-lg border") # remove overflow-hidden on TiltCard if it cuts off, actually leave it. Wait, the TiltCard has overflow-hidden, but FlipCard front/back don't have overflow-hidden inline.

with open("src/components/Bento.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Bento height increased.")
