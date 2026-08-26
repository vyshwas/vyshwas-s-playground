import os

with open("src/components/Hero.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Slightly reduce the extreme brightness of the color grade shader
content = content.replace("uBrightness: { value: 0.55 }", "uBrightness: { value: 0.45 }")
content = content.replace("uContrast: { value: 1.25 }", "uContrast: { value: 1.15 }")
content = content.replace("uGain: { value: new THREE.Vector3(1.05, 1.02, 0.98) }", "uGain: { value: new THREE.Vector3(0.95, 0.92, 0.88) }")

with open("src/components/Hero.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Color grade adjusted.")
