import sys
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
    from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Flip upside down
    img = img.transpose(Image.FLIP_TOP_BOTTOM)
    
    data = img.getdata()
    new_data = []
    
    for item in data:
        r, g, b, a = item
        # Remove near-white pixels (JPEG artifacts)
        if r > 220 and g > 220 and b > 220:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

process_image("assets/logo.jpg", "assets/logo.png")
