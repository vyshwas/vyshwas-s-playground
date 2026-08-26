import os

with open("src/components/FooterExit.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("hello@vyshwas.design", "vyommehta197@gmail.com")

with open("src/components/FooterExit.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated email in footer")
