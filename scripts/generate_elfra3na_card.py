# -*- coding: utf-8 -*-
"""
Generate the Official Luxury Promotional Card for El-Fra3na (فسيخ ورنجة الفراعنة)
Theme: Pharaonic Smoked Amber Gold & Oceanic Obsidian (#071524, #0d2137, #f59e0b)
Dual QR Codes:
  1. Web Storefront: https://elfra3na.vercel.app
  2. Android App (APK): https://elfra3na.vercel.app/download
100% Arabic typography safety via arabic_reshaper & python-bidi.
"""
import os
import math
import qrcode
import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image, ImageDraw, ImageFont

def ar(text):
    if not text:
        return ""
    # Strip emojis and problematic characters from Arabic strings
    clean = (text.replace("🐬", "")
                 .replace("🐟", "")
                 .replace("👑", "")
                 .replace("⭐", "")
                 .replace("🔥", "")
                 .replace("📱", "")
                 .replace("🛵", "")
                 .replace("⚡", "")
                 .replace("📦", "")
                 .replace("✨", "")
                 .replace("📍", "")
                 .replace("📞", "")
                 .strip())
    reshaped = arabic_reshaper.reshape(clean)
    return get_display(reshaped)

def draw_pin_icon(draw, cx, cy, color):
    draw.ellipse([(cx - 9, cy - 13), (cx + 9, cy + 5)], fill=color)
    draw.polygon([(cx - 8, cy - 1), (cx + 8, cy - 1), (cx, cy + 13)], fill=color)
    draw.ellipse([(cx - 4, cy - 7), (cx + 4, cy + 1)], fill=(7, 21, 36))

def draw_clock_icon(draw, cx, cy, color):
    draw.ellipse([(cx - 11, cy - 11), (cx + 11, cy + 11)], outline=color, width=3)
    draw.line([(cx, cy - 6), (cx, cy), (cx + 5, cy)], fill=color, width=3)

def draw_truck_icon(draw, cx, cy, color):
    draw.rounded_rectangle([(cx - 15, cy - 8), (cx + 3, cy + 6)], radius=2, fill=color)
    draw.rounded_rectangle([(cx + 3, cy - 3), (cx + 13, cy + 6)], radius=2, fill=color)
    draw.ellipse([(cx - 10, cy + 5), (cx - 3, cy + 12)], fill=(245, 158, 11))
    draw.ellipse([(cx + 5, cy + 5), (cx + 12, cy + 12)], fill=(245, 158, 11))

def draw_phone_icon(draw, cx, cy, color):
    draw.rounded_rectangle([(cx - 7, cy - 13), (cx + 7, cy + 13)], radius=3, outline=color, width=3)
    draw.ellipse([(cx - 2, cy + 6), (cx + 2, cy + 10)], fill=color)
    draw.line([(cx - 3, cy - 9), (cx + 3, cy - 9)], fill=color, width=2)

def generate_elfra3na_card():
    # Card Canvas: 1200 x 1750 (Master Luxury Print & Digital Scale)
    W, H = 1200, 1750
    
    # Palette: Oceanic Obsidian & Pharaonic Smoked Amber Gold
    BG_DARK      = (7, 21, 36)        # #071524 - Deep Oceanic Obsidian
    PANEL_BG     = (13, 33, 55)       # #0d2137 - Deep Slate Navy
    CARD_INNER   = (10, 26, 44)       # #0a1a2c
    GOLD_MAIN    = (245, 158, 11)     # #f59e0b - Pharaonic Amber Gold
    GOLD_LIGHT   = (251, 191, 36)     # #fbbf24 - Radiant Gold
    GOLD_DEEP    = (180, 83, 9)       # #b45309 - Smoked Bronze
    EMERALD      = (16, 185, 129)     # #10b981 - Fresh Seafood Mint
    WHITE        = (255, 255, 255)
    OFF_WHITE    = (241, 245, 249)    # #f1f5f9
    MUTED        = (148, 163, 184)    # #94a3b8
    BORDER_GLOW  = (217, 119, 6)      # #d97706
    
    card = Image.new("RGB", (W, H), color=BG_DARK)
    draw = ImageDraw.Draw(card)
    
    # Fonts
    font_dir = "C:/Windows/Fonts"
    f_en_top     = ImageFont.truetype(os.path.join(font_dir, "georgiab.ttf"), 25)
    f_title_big  = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 54)
    f_title_sub  = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 26)
    f_ribbon     = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 21)
    f_panel_hdr  = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 28)
    f_panel_sub  = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 22)
    f_panel_dsc  = ImageFont.truetype(os.path.join(font_dir, "tahoma.ttf"), 17)
    f_url_pill   = ImageFont.truetype(os.path.join(font_dir, "georgiab.ttf"), 19)
    f_badge_pill = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 17)
    f_feat_txt   = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 21)
    f_box_hdr    = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 26)
    f_body_bold  = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 20)
    f_body       = ImageFont.truetype(os.path.join(font_dir, "tahoma.ttf"), 18)
    f_dev_txt    = ImageFont.truetype(os.path.join(font_dir, "tahomabd.ttf"), 20)
    f_small      = ImageFont.truetype(os.path.join(font_dir, "tahoma.ttf"), 15)
    
    # 1. Double Luxury Borders
    draw.rounded_rectangle([(16, 16), (W - 16, H - 16)], radius=28, outline=GOLD_MAIN, width=4)
    draw.rounded_rectangle([(26, 26), (W - 26, H - 26)], radius=22, outline=BORDER_GLOW, width=2)
    draw.rounded_rectangle([(34, 34), (W - 34, H - 34)], radius=18, outline=PANEL_BG, width=1)
    
    # 2. Top Pharaonic Header Banner
    header_top = 44
    header_h   = 350
    draw.rounded_rectangle([(44, header_top), (W - 44, header_top + header_h)], radius=24, fill=PANEL_BG, outline=GOLD_DEEP, width=2)
    
    # Golden accent top bar
    draw.rounded_rectangle([(44, header_top), (W - 44, header_top + 10)], radius=8, fill=GOLD_MAIN)
    
    # Center Circular Emblem Logo
    logo_path = r"d:\Work\elfra3na\public\logo.png"
    logo_size = 135
    logo_cx = W // 2
    logo_cy = header_top + 80
    if os.path.exists(logo_path):
        logo_im = Image.open(logo_path).convert("RGBA").resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        # Gold circular frame behind logo
        draw.ellipse([logo_cx - logo_size//2 - 6, logo_cy - logo_size//2 - 6,
                      logo_cx + logo_size//2 + 6, logo_cy + logo_size//2 + 6],
                     fill=BG_DARK, outline=GOLD_MAIN, width=4)
        card.paste(logo_im, (logo_cx - logo_size//2, logo_cy - logo_size//2), logo_im)
        
    # English Header
    y_hdr = header_top + 165
    draw.text((W // 2, y_hdr), "EL-FRA3NA • SEAFOOD & SMOKED DELICACIES", font=f_en_top, fill=GOLD_LIGHT, anchor="mm")
    
    # Arabic Main Title: فسيخ ورنجة الفراعنة
    y_hdr += 52
    title_ar = ar("فسيخ ورنجة الفراعنة")
    draw.text((W // 2, y_hdr), title_ar, font=f_title_big, fill=WHITE, anchor="mm")
    
    # Subtitle: ملوك الأسماك المملحة والمدخنة والبطارخ الفاخرة • أصل الصنعة من 1990
    y_hdr += 48
    sub_ar = ar("ملوك الأسماك المملحة والمدخنة والبطارخ الفاخرة • أصل الصنعة من 1990")
    draw.text((W // 2, y_hdr), sub_ar, font=f_title_sub, fill=GOLD_LIGHT, anchor="mm")
    
    # 3. Gold Feature Ribbon
    ribbon_y1 = header_top + header_h + 18
    ribbon_h  = 54
    draw.rounded_rectangle([(44, ribbon_y1), (W - 44, ribbon_y1 + ribbon_h)], radius=18, fill=GOLD_MAIN)
    ribbon_txt = ar("منظومة سحابية متكاملة: منيو دليفري • كاشير ميزان POS • شات مباشر وتتبع لحظي")
    draw.text((W // 2, ribbon_y1 + ribbon_h // 2), ribbon_txt, font=f_ribbon, fill=BG_DARK, anchor="mm")
    
    # 4. Generate High-Res QR Codes
    # Web QR
    web_url = "https://elfra3na.vercel.app"
    qr_web_gen = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=1)
    qr_web_gen.add_data(web_url)
    qr_web_gen.make(fit=True)
    img_qr_web = qr_web_gen.make_image(fill_color="#071524", back_color="white").convert("RGB")
    
    # APK QR
    apk_url = "https://elfra3na.vercel.app/download"
    qr_apk_gen = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=1)
    qr_apk_gen.add_data(apk_url)
    qr_apk_gen.make(fit=True)
    img_qr_apk = qr_apk_gen.make_image(fill_color="#071524", back_color="white").convert("RGB")
    
    # 5. Dual QR Cards Section
    cards_y = ribbon_y1 + ribbon_h + 24
    card_w  = 532
    card_h  = 625
    
    # RTL Layout: Right Box = Android App, Left Box = Web Storefront
    col_right_x = W - 44 - card_w   # 624
    col_left_x  = 44                # 44
    
    qr_box_size = 280
    
    # === RIGHT BOX: Official Android App ===
    draw.rounded_rectangle([(col_right_x, cards_y), (col_right_x + card_w, cards_y + card_h)],
                           radius=22, fill=CARD_INNER, outline=BORDER_GLOW, width=3)
    
    # Header Bar for App Box
    draw.rounded_rectangle([(col_right_x, cards_y), (col_right_x + card_w, cards_y + 70)],
                           radius=20, fill=PANEL_BG)
    draw.rounded_rectangle([(col_right_x, cards_y + 56), (col_right_x + card_w, cards_y + 70)],
                           radius=0, fill=PANEL_BG)
    draw.line([(col_right_x, cards_y + 70), (col_right_x + card_w, cards_y + 70)], fill=GOLD_MAIN, width=2)
    
    head_apk = ar("تطبيق الأندرويد الرسمي (APK)")
    draw.text((col_right_x + card_w // 2, cards_y + 35), head_apk, font=f_panel_hdr, fill=GOLD_LIGHT, anchor="mm")
    
    # QR Container with White Card
    qr_rx = col_right_x + (card_w - qr_box_size) // 2
    qr_ry = cards_y + 90
    draw.rounded_rectangle([(qr_rx - 10, qr_ry - 10), (qr_rx + qr_box_size + 10, qr_ry + qr_box_size + 10)],
                           radius=16, fill=WHITE, outline=GOLD_MAIN, width=3)
    img_qr_apk_resized = img_qr_apk.resize((qr_box_size, qr_box_size), Image.Resampling.LANCZOS)
    card.paste(img_qr_apk_resized, (qr_rx, qr_ry))
    
    # Action text under QR
    t_apk_y = qr_ry + qr_box_size + 24
    draw.text((col_right_x + card_w // 2, t_apk_y), ar("امسح الكود لتحميل وتثبيت التطبيق مباشرة"), font=f_panel_sub, fill=WHITE, anchor="mm")
    draw.text((col_right_x + card_w // 2, t_apk_y + 28), ar("تطبيق خفيف وسريع لكافة هواتف الأندرويد"), font=f_panel_dsc, fill=MUTED, anchor="mm")
    draw.text((col_right_x + card_w // 2, t_apk_y + 50), ar("إشعارات فورية وتتبع خطوة بخطوة للطلب"), font=f_panel_dsc, fill=MUTED, anchor="mm")
    
    # URL Pill (English clean)
    pill_w = 420
    pill_h = 42
    pill_rx = col_right_x + (card_w - pill_w) // 2
    pill_ry = cards_y + card_h - 105
    draw.rounded_rectangle([(pill_rx, pill_ry), (pill_rx + pill_w, pill_ry + pill_h)],
                           radius=21, fill=BG_DARK, outline=GOLD_MAIN, width=2)
    draw.text((col_right_x + card_w // 2, pill_ry + pill_h // 2), "elfra3na.vercel.app/download", font=f_url_pill, fill=GOLD_LIGHT, anchor="mm")
    
    # Green Verification Badge
    badge_apk = ar("إصدار رسمي معتمد v1.0.0 • تحميل مجاني")
    draw.text((col_right_x + card_w // 2, pill_ry + pill_h + 24), badge_apk, font=f_badge_pill, fill=EMERALD, anchor="mm")
    
    
    # === LEFT BOX: Web Storefront ===
    draw.rounded_rectangle([(col_left_x, cards_y), (col_left_x + card_w, cards_y + card_h)],
                           radius=22, fill=CARD_INNER, outline=BORDER_GLOW, width=3)
    
    # Header Bar for Web Box
    draw.rounded_rectangle([(col_left_x, cards_y), (col_left_x + card_w, cards_y + 70)],
                           radius=20, fill=PANEL_BG)
    draw.rounded_rectangle([(col_left_x, cards_y + 56), (col_left_x + card_w, cards_y + 70)],
                           radius=0, fill=PANEL_BG)
    draw.line([(col_left_x, cards_y + 70), (col_left_x + card_w, cards_y + 70)], fill=GOLD_MAIN, width=2)
    
    head_web = ar("المتجر الإلكتروني المباشر (Web)")
    draw.text((col_left_x + card_w // 2, cards_y + 35), head_web, font=f_panel_hdr, fill=GOLD_LIGHT, anchor="mm")
    
    # QR Container with White Card
    qr_lx = col_left_x + (card_w - qr_box_size) // 2
    draw.rounded_rectangle([(qr_lx - 10, qr_ry - 10), (qr_lx + qr_box_size + 10, qr_ry + qr_box_size + 10)],
                           radius=16, fill=WHITE, outline=GOLD_MAIN, width=3)
    img_qr_web_resized = img_qr_web.resize((qr_box_size, qr_box_size), Image.Resampling.LANCZOS)
    card.paste(img_qr_web_resized, (qr_lx, qr_ry))
    
    # Action text under QR
    draw.text((col_left_x + card_w // 2, t_apk_y), ar("امسح الكود للطلب أونلاين فوراً بدون تحميل"), font=f_panel_sub, fill=WHITE, anchor="mm")
    draw.text((col_left_x + card_w // 2, t_apk_y + 28), ar("يعمل على جميع الأجهزة (آيفون، أندرويد، كمبيوتر)"), font=f_panel_dsc, fill=MUTED, anchor="mm")
    draw.text((col_left_x + card_w // 2, t_apk_y + 50), ar("منيو صور تفاعلي واختيار أوزان وتجهيز مخصص"), font=f_panel_dsc, fill=MUTED, anchor="mm")
    
    # URL Pill
    pill_lx = col_left_x + (card_w - pill_w) // 2
    draw.rounded_rectangle([(pill_lx, pill_ry), (pill_lx + pill_w, pill_ry + pill_h)],
                           radius=21, fill=BG_DARK, outline=GOLD_MAIN, width=2)
    draw.text((col_left_x + card_w // 2, pill_ry + pill_h // 2), "elfra3na.vercel.app", font=f_url_pill, fill=GOLD_LIGHT, anchor="mm")
    
    # Green Verification Badge
    badge_web = ar("طلب فوري • دفع عند الاستلام • إنستاباي")
    draw.text((col_left_x + card_w // 2, pill_ry + pill_h + 24), badge_web, font=f_badge_pill, fill=EMERALD, anchor="mm")
    
    
    # 6. Three Generous Features Strip
    feat_y = cards_y + card_h + 20
    feat_h = 62
    draw.rounded_rectangle([(44, feat_y), (W - 44, feat_y + feat_h)], radius=18, fill=PANEL_BG, outline=GOLD_MAIN, width=2)
    
    features = [
        "توصيل سريع للقاهرة والجيزة",
        "تغليف فاكيوم محكم طازج 100%",
        "دفع نقدياً • فيزا • إنستاباي"
    ]
    fw = (W - 88) // 3
    for i, feat in enumerate(features):
        ft_txt = ar(feat)
        # RTL order
        fx = 44 + (2 - i) * fw + fw // 2
        draw.text((fx, feat_y + feat_h // 2), ft_txt, font=f_feat_txt, fill=GOLD_LIGHT, anchor="mm")
        if i < 2:
            sep_x = 44 + (2 - i) * fw
            draw.ellipse([(sep_x - 3, feat_y + feat_h // 2 - 3), (sep_x + 3, feat_y + feat_h // 2 + 3)], fill=BORDER_GLOW)
            
    # 7. Branch & Coverage Information Box (4 Rich Rows)
    info_y1 = feat_y + feat_h + 20
    info_h  = 320
    draw.rounded_rectangle([(44, info_y1), (W - 44, info_y1 + info_h)], radius=22, fill=CARD_INNER, outline=BORDER_GLOW, width=2)
    
    # Info Box Header
    draw.rounded_rectangle([(44, info_y1), (W - 44, info_y1 + 52)], radius=20, fill=PANEL_BG)
    draw.rounded_rectangle([(44, info_y1 + 38), (W - 44, info_y1 + 52)], radius=0, fill=PANEL_BG)
    info_hdr_txt = ar("فروع فسيخ ورنجة الفراعنة ونطاق التغطية بالقاهرة الكبرى")
    draw.text((W // 2, info_y1 + 26), info_hdr_txt, font=f_box_hdr, fill=GOLD_LIGHT, anchor="mm")
    
    # 4 Info Rows inside box
    row_y = info_y1 + 65
    info_items = [
        (draw_pin_icon, "عناوين الفروع:", "فيصل الرئيسي (المطبعة) • ألف مسكن (جسر السويس) • 6 أكتوبر • حدائق القبة • زهراء المعادي", GOLD_LIGHT),
        (draw_phone_icon, "الخط الساخن:", "01000388911  •  01069717413  (اتصال وواتساب لجميع الفروع على مدار اليوم)", WHITE),
        (draw_truck_icon, "الشحن والتوصيل:", "أسطول دليفري مجهز بحوافظ حرارية وسيارات مبردة لتوصيل طلبات الحفلات والعزومات", OFF_WHITE),
        (draw_clock_icon, "مواعيد العمل:", "يومياً من الساعة 9:00 صباحاً حتى الساعة 2:00 بعد منتصف الليل طوال أيام الأسبوع", OFF_WHITE)
    ]
    
    for icon_fn, label, val, val_clr in info_items:
        # Background pill
        draw.rounded_rectangle([(60, row_y), (W - 60, row_y + 52)], radius=14, fill=PANEL_BG)
        # Icon
        icon_fn(draw, W - 92, row_y + 26, GOLD_LIGHT)
        
        # Label
        lbl_txt = ar(label)
        draw.text((W - 120, row_y + 26), lbl_txt, font=f_body_bold, fill=GOLD_MAIN, anchor="rm")
        
        # Value
        val_txt = ar(val)
        draw.text((80, row_y + 26), val_txt, font=f_body, fill=val_clr, anchor="lm")
        
        row_y += 60
        
    # 8. Mandatory Footer Attribution
    foot_y = info_y1 + info_h + 24
    
    # Subtle golden separator line with central diamond
    draw.line([(W // 2 - 320, foot_y), (W // 2 + 320, foot_y)], fill=GOLD_DEEP, width=1)
    draw.ellipse([(W // 2 - 4, foot_y - 4), (W // 2 + 4, foot_y + 4)], fill=GOLD_MAIN)
    
    dev_txt = ar("تم تطوير وبرمجة النظام بواسطة شركة أوركا للحلول البرمجية والخدمات السحابية")
    draw.text((W // 2, foot_y + 22), dev_txt, font=f_dev_txt, fill=GOLD_LIGHT, anchor="mm")
    
    eng_credit = "Orca Cloud & Enterprise Software Solutions • https://elfra3na.vercel.app"
    draw.text((W // 2, foot_y + 48), eng_credit, font=f_small, fill=MUTED, anchor="mm")
    
    # Outputs
    public_out = r"d:\Work\elfra3na\public\elfra3na-official-card.png"
    brain_out  = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d\elfra3na-official-card.png"
    
    card.save(public_out, quality=98)
    card.save(brain_out, quality=98)
    print(f"[SUCCESS] El-Fra3na Official Luxury Card regenerated successfully at:")
    print(f"  -> {public_out}")
    print(f"  -> {brain_out}")

if __name__ == "__main__":
    generate_elfra3na_card()
