# -*- coding: utf-8 -*-
"""
Generate Royal Pharaonic Seafood Logo for El-Fra3na (فسيخ ورنجة الفراعنة)
Features:
- Dark Oceanic Obsidian (#071524) background circle with double Pharaonic Gold rims
- Golden Pharaonic Crown & Lotus rays on top
- Dynamic Royal Golden Fish in the center
- Oceanic waves and '1990' royal crest
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

def draw_elfra3na_logo(output_size=512):
    # Render at 2x for antialiasing
    size = output_size * 2
    cx, cy = size // 2, size // 2
    r = size // 2 - 20
    
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    OCEAN_DARK = (7, 21, 36, 255)       # #071524
    OCEAN_NAVY = (13, 33, 55, 255)      # #0d2137
    GOLD_MAIN  = (245, 158, 11, 255)    # #f59e0b
    GOLD_LIGHT = (251, 191, 36, 255)    # #fbbf24
    GOLD_DARK  = (180, 83, 9, 255)      # #b45309
    EMERALD    = (16, 185, 129, 255)    # #10b981
    CYAN_SEA   = (14, 165, 233, 255)    # #0ea5e9
    WHITE      = (255, 255, 255, 255)
    
    # 1. Outer glow & background circle
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=OCEAN_DARK, outline=GOLD_MAIN, width=14)
    draw.ellipse([cx - r + 18, cy - r + 18, cx + r - 18, cy + r - 18], outline=GOLD_LIGHT, width=4)
    draw.ellipse([cx - r + 30, cy - r + 30, cx + r - 30, cy + r - 30], fill=OCEAN_NAVY, outline=GOLD_DARK, width=3)
    
    # Decorative dots on outer rim
    num_dots = 48
    dot_radius = r - 9
    for i in range(num_dots):
        angle = 2 * math.pi * i / num_dots
        dx = cx + dot_radius * math.cos(angle)
        dy = cy + dot_radius * math.sin(angle)
        draw.ellipse([dx - 4, dy - 4, dx + 4, dy + 4], fill=GOLD_LIGHT)
        
    # 2. Pharaonic Crown / Solar Disc at Top
    crown_y = cy - 280
    # Solar Disc
    draw.ellipse([cx - 45, crown_y, cx + 45, crown_y + 90], fill=GOLD_MAIN, outline=GOLD_LIGHT, width=4)
    # Cobra / Horns crescent cradling disc
    draw.arc([cx - 70, crown_y - 20, cx + 70, crown_y + 110], start=30, end=150, fill=GOLD_LIGHT, width=8)
    
    # 3. Dynamic Royal Fish Silhouette in Center
    # Fish Body: stylized organic bezier / polygon curves
    fish_pts = [
        # Nose
        (cx - 240, cy + 30),
        # Upper Head
        (cx - 180, cy - 60),
        # Forehead & Dorsal base
        (cx - 100, cy - 110),
        (cx, cy - 130),
        # Dorsal fin top peak
        (cx + 80, cy - 160),
        (cx + 120, cy - 120),
        # Back toward tail
        (cx + 160, cy - 60),
        (cx + 200, cy - 20),
        # Tail Wrist
        (cx + 250, cy - 10),
        # Tail Fin Upper Fluke
        (cx + 340, cy - 90),
        (cx + 310, cy - 10),
        # Tail Center Notch
        (cx + 270, cy),
        # Tail Fin Lower Fluke
        (cx + 310, cy + 30),
        (cx + 330, cy + 90),
        # Tail Wrist Lower
        (cx + 240, cy + 30),
        # Belly curve
        (cx + 160, cy + 70),
        (cx + 70, cy + 110),
        # Pelvic fin peak
        (cx + 10, cy + 145),
        (cx - 40, cy + 100),
        # Chin
        (cx - 140, cy + 70),
        (cx - 200, cy + 50)
    ]
    draw.polygon(fish_pts, fill=GOLD_MAIN, outline=GOLD_LIGHT)
    
    # Fish Inner Accents (Gills, Scales, Eye, Body Segments)
    # Eye:
    draw.ellipse([cx - 170, cy - 20, cx - 130, cy + 20], fill=OCEAN_DARK, outline=WHITE, width=4)
    draw.ellipse([cx - 155, cy - 8, cx - 140, cy + 8], fill=GOLD_LIGHT)
    
    # Gill Slits:
    draw.arc([cx - 130, cy - 80, cx - 60, cy + 60], start=280, end=80, fill=OCEAN_DARK, width=6)
    draw.arc([cx - 110, cy - 70, cx - 45, cy + 50], start=280, end=80, fill=OCEAN_DARK, width=5)
    
    # Elegant Golden Scales (Arcs)
    scale_rows = [
        (cx - 40, cy - 50, 4),
        (cx + 10, cy - 30, 4),
        (cx + 60, cy - 40, 3),
        (cx + 110, cy - 20, 3),
        (cx + 160, cy - 10, 2),
    ]
    for sx, sy, count in scale_rows:
        for j in range(count):
            oy = sy + (j - count/2) * 28
            draw.arc([sx - 20, oy - 15, sx + 20, oy + 15], start=280, end=80, fill=GOLD_DARK, width=4)
            
    # Dorsal fin rays
    for ray_x in [cx - 60, cx - 20, cx + 20, cx + 60, cx + 90]:
        draw.line([(ray_x, cy - 100), (ray_x + 20, cy - 140)], fill=GOLD_LIGHT, width=4)
        
    # Tail fin rays
    for ray_y in [-60, -30, 0, 30, 60]:
        draw.line([(cx + 250, cy), (cx + 310, cy + ray_y)], fill=GOLD_LIGHT, width=3)
        
    # 4. Oceanic Waves at bottom
    wave_y = cy + 220
    # Three layered wave ribbons
    for wave_offset, wave_clr, width in [
        (30, CYAN_SEA, 6),
        (0, GOLD_MAIN, 5),
        (-30, EMERALD, 4)
    ]:
        pts = []
        for x_step in range(cx - 240, cx + 245, 10):
            y_val = wave_y + wave_offset + 14 * math.sin((x_step - cx) * 0.02)
            pts.append((x_step, y_val))
        for k in range(len(pts) - 1):
            draw.line([pts[k], pts[k+1]], fill=wave_clr, width=width)
            
    # 5. Pharaonic Pyramid / Chevron at bottom
    pyr_pts = [(cx - 40, cy + 330), (cx, cy + 270), (cx + 40, cy + 330)]
    draw.polygon(pyr_pts, fill=GOLD_MAIN, outline=GOLD_LIGHT)
    
    # Text "SINCE 1990"
    try:
        f_yr = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 36)
        draw.text((cx, cy + 360), "SINCE 1990", font=f_yr, fill=GOLD_LIGHT, anchor="mm")
    except Exception:
        pass
        
    # Downsample cleanly to final output size with LANCZOS
    final_img = img.resize((output_size, output_size), Image.Resampling.LANCZOS)
    return final_img

if __name__ == "__main__":
    logo = draw_elfra3na_logo(512)
    
    # Save to public directory
    public_dir = r"d:\Work\elfra3na\public"
    brain_dir = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d"
    
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(brain_dir, exist_ok=True)
    
    logo.save(os.path.join(public_dir, "logo.png"))
    logo.save(os.path.join(public_dir, "app-icon.png"))
    logo.save(os.path.join(brain_dir, "elfra3na-logo.png"))
    print("[SUCCESS] El-Fra3na Royal Pharaonic Seafood Logo generated successfully!")
