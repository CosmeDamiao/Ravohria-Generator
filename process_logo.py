#!/usr/bin/env python3
from PIL import Image
import math

# Create a circular logo template based on the provided image
# (Orange/golden background with pig characters)

def create_circular_logo():
    # Create a 1024x1024 image (high resolution source)
    size = 1024
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # Draw the orange/golden circular background
    center = size // 2
    radius = size // 2
    
    # Create circular mask
    for y in range(size):
        for x in range(size):
            dist = math.sqrt((x - center) ** 2 + (y - center) ** 2)
            if dist <= radius:
                # Orange/golden color (#D9964A)
                img.putpixel((x, y), (217, 150, 74, 255))
    
    return img

def resize_and_center(img, target_size):
    """Resize image maintaining aspect ratio and center it"""
    img_copy = img.copy()
    img_copy.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    # Create new image with exact target size
    result = Image.new('RGBA', target_size, (0, 0, 0, 0))
    offset_x = (target_size[0] - img_copy.width) // 2
    offset_y = (target_size[1] - img_copy.height) // 2
    result.paste(img_copy, (offset_x, offset_y))
    
    return result

def main():
    print("Creating logo files...")
    
    # Check if there's an existing logo to use
    try:
        source_img = Image.open('public/ninetyone-logo-back2.png')
        print("Using existing logo: public/ninetyone-logo-back2.png")
    except:
        print("Creating template logo...")
        source_img = create_circular_logo()
        source_img.save('public/source_logo.png', 'PNG')
        print("Template saved as: public/source_logo.png")
    
    # Ensure RGBA mode
    if source_img.mode != 'RGBA':
        source_img = source_img.convert('RGBA')
    
    # Create logo192.png
    print("Creating logo192.png...")
    logo192 = resize_and_center(source_img, (192, 192))
    logo192.save('public/logo192.png', 'PNG', optimize=True)
    print("✓ Saved: public/logo192.png")
    
    # Create logo512.png
    print("Creating logo512.png...")
    logo512 = resize_and_center(source_img, (512, 512))
    logo512.save('public/logo512.png', 'PNG', optimize=True)
    print("✓ Saved: public/logo512.png")
    
    # Create favicon.ico with multiple sizes
    print("Creating favicon.ico...")
    favicon_sizes = [(16, 16), (32, 32), (48, 48)]
    favicon_images = []
    
    for size in favicon_sizes:
        favicon_img = resize_and_center(source_img, size)
        favicon_images.append(favicon_img)
    
    # Save as ICO with multiple sizes
    favicon_images[0].save(
        'public/favicon.ico',
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("✓ Saved: public/favicon.ico")
    
    print("\n✅ All logo files created successfully!")
    print("\nFiles created:")
    print("  - public/favicon.ico (16x16, 32x32, 48x48)")
    print("  - public/logo192.png (192x192)")
    print("  - public/logo512.png (512x512)")

if __name__ == '__main__':
    main()
