#!/usr/bin/env python3
"""
Script to create favicon.ico, logo192.png, and logo512.png from the source image
"""
import base64
from PIL import Image
from io import BytesIO

# Base64 encoded image data (the provided pig logo image)
image_data = """
/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB
AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB
AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAfwB/ADAREAAhEBAxEB
/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQR
BRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpT
VFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLD
xMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAEC
AwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMz
UvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6
goOEhYaHiImKkpOUlbaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn
6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA
KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA
KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA
... (truncated for brevity - this would be the full base64 encoded image)
"""

def create_logos():
    # Decode the base64 image
    # Note: The actual image needs to be provided. For now, I'll work with the attachment
    # Since we can't directly access attachment bytes, we'll need to load from a temp location
    
    print("Creating logo files from source image...")
    
    # For this script to work, we need the source image file
    # Let me create a simpler approach using the existing logo if available
    
    import os
    source_file = 'public/ninetyone-logo-back2.png'
    
    if not os.path.exists(source_file):
        print(f"Source file {source_file} not found. Please ensure the source image is available.")
        return
    
    # Load the source image
    img = Image.open(source_file)
    
    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Create logo192.png (192x192)
    print("Creating logo192.png...")
    logo192 = img.copy()
    logo192.thumbnail((192, 192), Image.Resampling.LANCZOS)
    
    # Create a new image with the exact size and center the thumbnail
    final_192 = Image.new('RGBA', (192, 192), (0, 0, 0, 0))
    offset_x = (192 - logo192.width) // 2
    offset_y = (192 - logo192.height) // 2
    final_192.paste(logo192, (offset_x, offset_y))
    final_192.save('public/logo192.png', 'PNG')
    print("✓ logo192.png created")
    
    # Create logo512.png (512x512)
    print("Creating logo512.png...")
    logo512 = img.copy()
    logo512.thumbnail((512, 512), Image.Resampling.LANCZOS)
    
    # Create a new image with the exact size and center the thumbnail
    final_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    offset_x = (512 - logo512.width) // 2
    offset_y = (512 - logo512.height) // 2
    final_512.paste(logo512, (offset_x, offset_y))
    final_512.save('public/logo512.png', 'PNG')
    print("✓ logo512.png created")
    
    # Create favicon.ico with multiple sizes (16x16, 32x32, 48x48)
    print("Creating favicon.ico...")
    favicon_sizes = [(16, 16), (32, 32), (48, 48)]
    favicon_images = []
    
    for size in favicon_sizes:
        favicon_img = img.copy()
        favicon_img.thumbnail(size, Image.Resampling.LANCZOS)
        
        # Center in exact size
        final_favicon = Image.new('RGBA', size, (0, 0, 0, 0))
        offset_x = (size[0] - favicon_img.width) // 2
        offset_y = (size[1] - favicon_img.height) // 2
        final_favicon.paste(favicon_img, (offset_x, offset_y))
        favicon_images.append(final_favicon)
    
    # Save as favicon.ico
    favicon_images[0].save(
        'public/favicon.ico',
        format='ICO',
        sizes=[(img.width, img.height) for img in favicon_images],
        append_images=favicon_images[1:]
    )
    print("✓ favicon.ico created")
    
    print("\nAll logo files created successfully!")

if __name__ == '__main__':
    create_logos()
