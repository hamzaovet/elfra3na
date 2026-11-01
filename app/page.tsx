"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { playSound } from "@/lib/sounds";
import CustomerChatWidget from "@/components/CustomerChatWidget";
import { ALL_DELIVERY_ZONES, DEFAULT_ZONE, ZoneItem } from "@/lib/zones";
import {
  ShoppingCart, X, Plus, Minus, Search,
  MapPin, Phone, Clock, CheckCircle2, Loader2,
  Bike, Store, Utensils, ChevronRight, ChevronLeft,
  Sparkles, Flame, Gift, ArrowLeft, ArrowRight,
  Award, QrCode, Ticket, Check, Star, AlertCircle,
  Scale, ShieldCheck, Heart, Share2, Smartphone
} from "lucide-react";

interface ProductSize {
  nameAr: string;
  nameEn?: string;
  price: number;
  weightGrams?: number;
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryId?: string | null;
  categoryName?: string | null;
  basePrice: number;
  originalPrice?: number | null;
  promoPrice?: number | null;
  promoDays?: string | null;
  promoActive?: boolean;
  isFlashDeal?: boolean;
  isWeightItem?: boolean;
  scaleItemCode?: string | null;
  weightUnit?: string | null;
  sizes?: string | null;
  modifiers?: string | null;
  packageType?: string | null;
  trayComponents?: string | null;
  image?: string | null;
  description?: string | null;
  isAvailable: boolean;
  sortOrder?: number;
}

interface CartItem {
  product: Product;
  qty: number;
  extras: string[];
  unitPrice: number;
  selectedSize?: string | null;
  weightGrams?: number;
}

const HERO_SLIDES = [
  {
    id: "box-ramses",
    badge: "وفر 90 ج.م 🔥 العرض الأكثر طلباً",
    title: "بوكس رمسيس الثاني الملكي الفاخر",
    subtitle: "نصف كيلو فسيخ بوري مخلي زبدة + نصف كيلو رنجة هولندي فيليه بدون شوك + برطمان بطارخ خرز + سلطة طحينة وليمون معصفر و10 أرغفة عيش سخن.",
    price: 590,
    originalPrice: 680,
    note: "يكفي 3 إلى 4 أفراد جاهز للأكل والتقديم فوراً بدون أي مجهود تنظيف!",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    cta: "اطلب البوكس الآن",
  },
  {
    id: "feseekh-jumbo",
    badge: "نخب أول 👑 زبدة سايحة",
    title: "فسيخ بوري بلدي سوبر جامبو",
    subtitle: "سمك بوري بحري أصيل طازج، ملوحة هادئة بدون أي زفارة، ينظف ويخلى عند الطلب مجاناً مع زيت الذرة الصافي وعصير الليمون والفلفل الحار.",
    price: 480,
    originalPrice: 530,
    note: "متاح سليم بالجلد أو مخلي قطع جاهز للأكل",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    cta: "اختر وزن الفسيخ",
  },
  {
    id: "herring-batarekh",
    badge: "قرمشة خرز أصيلة 🥇 مدخنة زان",
    title: "رنجة هولندي سوبر بطارخ خرز",
    subtitle: "رنجة ذهبية مدخنة على خشب الزان الطبيعي، لحم وردي متماسك قليل الملح ممتلئة بالكامل ببطارخ خرز خشنة مقرمشة من الرأس للذيل.",
    price: 290,
    originalPrice: 330,
    note: "تخلى وتشوى مجاناً حسب رغبتك",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    cta: "اطلب الرنجة الآن",
  },
  {
    id: "bottarga-gold",
    badge: "ذهب البحر الأصفر 🏆 بورسعيدي أصيل",
    title: "بطارخ بوري بورسعيدي مجففة شمع",
    subtitle: "أفخر أنواع البطارخ الطبيعية المجففة على أصولها البورسعيدية التراثية مغلفة بالشمع الطبيعي، تقطع شرائح رقيقة لسهرات الملوك.",
    price: 375,
    originalPrice: 420,
    note: "قالب وسط ~200 جم مغلف شمع عسلي",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    cta: "اطلب البطارخ الفاخرة",
  },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Hero carousel state
  const [heroIndex, setHeroIndex] = useState(0);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Branch & Zone state
  const [selectedBranch, setSelectedBranch] = useState("فرع فيصل الرئيسي (المطبعة)");
  const [selectedZone, setSelectedZone] = useState<ZoneItem>(DEFAULT_ZONE);
  const [orderType, setOrderType] = useState<"delivery" | "takeaway">("delivery");

  // Checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderNotes, setOrderNotes] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  // Product Customizer Modal
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedWeightGrams, setSelectedWeightGrams] = useState(500);
  const [selectedPackageType, setSelectedPackageType] = useState("مخلي بزيت وليمون");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products & categories from API
  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/products");
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data);
          const uniqueCats = Array.from(new Set(data.map(p => p.categoryName || "أخرى"))).filter(Boolean);
          setCategories(["الكل", ...uniqueCats]);
        }
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchCatalog();

    // Load Cart from localStorage
    try {
      const saved = localStorage.getItem("captain_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}

    // Listen for custom open cart event from navbar
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener("captain_open_cart", handleOpenCart);
    return () => window.removeEventListener("captain_open_cart", handleOpenCart);
  }, []);

  // Save Cart
  function saveCart(updated: CartItem[]) {
    setCart(updated);
    try {
      localStorage.setItem("captain_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("captain_cart_update"));
    } catch {}
  }

  function addToCartDirect(prod: Product) {
    playSound("pop");
    const unitPrice = prod.promoActive && prod.promoPrice ? prod.promoPrice : prod.basePrice;
    const existingIdx = cart.findIndex(
      item => item.product.id === prod.id && (!item.selectedSize) && (!item.extras || item.extras.length === 0)
    );

    let updated = [...cart];
    if (existingIdx >= 0) {
      updated[existingIdx].qty += 1;
    } else {
      updated.push({
        product: prod,
        qty: 1,
        extras: [],
        unitPrice,
        selectedSize: prod.isWeightItem ? "1 كجم" : undefined,
      });
    }
    saveCart(updated);
  }

  function openCustomizeModal(prod: Product) {
    playSound("click");
    setCustomizingProduct(prod);
    let parsedSizes: ProductSize[] = [];
    try {
      if (prod.sizes) parsedSizes = JSON.parse(prod.sizes);
    } catch {}

    setSelectedSize(parsedSizes.length > 0 ? parsedSizes[0] : null);
    setSelectedWeightGrams(500);
    setSelectedPackageType("مخلي بزيت وليمون");
    setSelectedExtras([]);
  }

  function addCustomizedToCart() {
    if (!customizingProduct) return;
    playSound("pop");

    let unitPrice = customizingProduct.promoActive && customizingProduct.promoPrice
      ? customizingProduct.promoPrice
      : customizingProduct.basePrice;

    let sizeLabel = "";
    if (selectedSize) {
      unitPrice = selectedSize.price;
      sizeLabel = selectedSize.nameAr;
    } else if (customizingProduct.isWeightItem) {
      unitPrice = (customizingProduct.basePrice * selectedWeightGrams) / 1000;
      sizeLabel = `${selectedWeightGrams} جم`;
    }

    const updated = [
      ...cart,
      {
        product: customizingProduct,
        qty: 1,
        extras: selectedExtras,
        unitPrice,
        selectedSize: sizeLabel,
        weightGrams: selectedWeightGrams,
      },
    ];

    saveCart(updated);
    setCustomizingProduct(null);
  }

  function updateQty(idx: number, delta: number) {
    playSound("click");
    const next = [...cart];
    const newQty = next[idx].qty + delta;
    if (newQty <= 0) {
      next.splice(idx, 1);
    } else {
      next[idx].qty = newQty;
    }
    saveCart(next);
  }

  function removeCartItem(idx: number) {
    playSound("trash");
    const next = cart.filter((_, i) => i !== idx);
    saveCart(next);
  }

  function clearCart() {
    saveCart([]);
  }

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);
  const deliveryFee = orderType === "delivery" ? selectedZone.fee : 0;
  const total = subtotal + deliveryFee;

  // Checkout submission
  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("يرجى إدخال اسم العميل ورقم الهاتف للتوصيل");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      alert("يرجى كتابة عنوان التوصيل بالتفصيل");
      return;
    }

    try {
      setSubmittingOrder(true);
      playSound("order");

      const itemsPayload = cart.map(item => ({
        productId: item.product.id,
        nameAr: item.product.nameAr,
        nameEn: item.product.nameEn,
        qty: item.qty,
        unitPrice: item.unitPrice,
        selectedSize: item.selectedSize || undefined,
        packageType: item.product.packageType || "جاهز",
        extras: item.extras,
        total: item.unitPrice * item.qty,
      }));

      const payload = {
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        address: orderType === "delivery" ? deliveryAddress.trim() : null,
        zone: orderType === "delivery" ? selectedZone.nameAr : "استلام من الفرع",
        branch: selectedBranch,
        orderType,
        status: "new",
        items: JSON.stringify(itemsPayload),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        notes: orderNotes.trim() || null,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
      }

      const orderData = await res.json();
      playSound("success");
      setOrderSuccess(orderData);
      clearCart();
      setCheckoutModalOpen(false);
    } catch (err: any) {
      alert(err.message || "فشل إرسال الطلب، تأكد من الاتصال بالإنترنت");
    } finally {
      setSubmittingOrder(false);
    }
  }

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === "الكل" || p.categoryName === activeCategory;
    const matchesSearch = !searchQuery.trim() ||
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#071524",
        color: "#f8fafc",
        fontFamily: "var(--font-cairo), sans-serif",
      }}
    >
      {/* ── 1. BRANCH & DELIVERY ZONE SELECTOR BAR ── */}
      <section
        style={{
          backgroundColor: "#0d2137",
          borderBottom: "1px solid #1a3654",
          padding: "10px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            fontSize: "13px",
          }}
        >
          {/* Branch Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin size={16} color="#f59e0b" />
            <span style={{ color: "#94a3b8" }}>الفرع الأقرب لك:</span>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              style={{
                backgroundColor: "#071524",
                border: "1px solid #1a3654",
                borderRadius: "8px",
                color: "#f59e0b",
                padding: "4px 10px",
                fontWeight: 800,
                fontSize: "12.5px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="فرع فيصل الرئيسي (المطبعة)">فرع فيصل الرئيسي (المطبعة)</option>
              <option value="فرع ألف مسكن (جسر السويس)">فرع ألف مسكن (جسر السويس)</option>
              <option value="فرع 6 أكتوبر (الحصري)">فرع 6 أكتوبر (الحصري)</option>
              <option value="فرع حدائق القبة">فرع حدائق القبة (مصر والسودان)</option>
              <option value="فرع زهراء المعادي">فرع زهراء المعادي (الخمسين)</option>
            </select>
          </div>

          {/* Delivery Zone / Speed estimate */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Bike size={16} color="#10b981" />
            <span style={{ color: "#94a3b8" }}>منطقة التوصيل:</span>
            <select
              value={selectedZone.code}
              onChange={e => {
                const z = ALL_DELIVERY_ZONES.find(x => x.code === e.target.value);
                if (z) setSelectedZone(z);
              }}
              style={{
                backgroundColor: "#071524",
                border: "1px solid #1a3654",
                borderRadius: "8px",
                color: "#10b981",
                padding: "4px 10px",
                fontWeight: 800,
                fontSize: "12.5px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {ALL_DELIVERY_ZONES.map(z => (
                <option key={z.code} value={z.code}>
                  {z.nameAr} (توصيل ~{z.timeMinutes} دقيقة • {z.fee} ج.م)
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── 2. HERO CAROUSEL ── */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#050e18",
          padding: "30px 16px 40px",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto", position: "relative" }}>
          {HERO_SLIDES.map((slide, idx) => {
            if (idx !== heroIndex) return null;
            return (
              <div
                key={slide.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "30px",
                  alignItems: "center",
                  backgroundColor: "#0d2137",
                  border: "2px solid #f59e0b",
                  borderRadius: "24px",
                  padding: "32px",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Text Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span
                    style={{
                      alignSelf: "start",
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                      color: "#f59e0b",
                      border: "1px solid rgba(245, 158, 11, 0.4)",
                      borderRadius: "100px",
                      padding: "4px 14px",
                      fontSize: "12px",
                      fontWeight: 900,
                    }}
                  >
                    {slide.badge}
                  </span>

                  <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#f8fafc", margin: 0, lineHeight: 1.2 }}>
                    {slide.title}
                  </h2>

                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                    {slide.subtitle}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "8px 0" }}>
                    <span style={{ fontSize: "32px", fontWeight: 900, color: "#f59e0b" }}>
                      {slide.price} ج.م
                    </span>
                    {slide.originalPrice && (
                      <span style={{ fontSize: "18px", color: "#64748b", textDecoration: "line-through" }}>
                        {slide.originalPrice} ج.م
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: "12px", color: "#10b981", margin: 0, fontWeight: 700 }}>
                    {slide.note}
                  </p>

                  <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                    <button
                      onClick={() => {
                        const matchProd = products.find(p => p.nameAr.includes(slide.title.slice(0, 6))) || products[0];
                        if (matchProd) openCustomizeModal(matchProd);
                      }}
                      style={{
                        backgroundColor: "#f59e0b",
                        color: "#071524",
                        border: "none",
                        borderRadius: "100px",
                        padding: "12px 28px",
                        fontSize: "14.5px",
                        fontWeight: 900,
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(245, 158, 11, 0.4)",
                      }}
                    >
                      {slide.cta} ⚡
                    </button>
                    <a
                      href="#menu-section"
                      style={{
                        backgroundColor: "#1a3654",
                        color: "#f8fafc",
                        border: "none",
                        borderRadius: "100px",
                        padding: "12px 20px",
                        fontSize: "13.5px",
                        fontWeight: 800,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      تصفح باقي الأسماك
                    </a>
                  </div>
                </div>

                {/* Hero Image */}
                <div style={{ height: "300px", borderRadius: "18px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            );
          })}

          {/* Dots Indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                style={{
                  width: i === heroIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "100px",
                  backgroundColor: i === heroIndex ? "#f59e0b" : "#1a3654",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SEARCH & CATEGORIES NAVIGATION ── */}
      <section
        id="menu-section"
        style={{
          position: "sticky",
          top: "60px",
          zIndex: 40,
          backgroundColor: "#071524",
          borderBottom: "1px solid #1a3654",
          padding: "14px 16px",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Search Input */}
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={18} style={{ position: "absolute", right: "14px", top: "12px", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="ابحث عن الفسيخ، الرنجة الهولندي، البطارخ، الملوحة، البوكسات..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: "42px",
                  backgroundColor: "#0d2137",
                  border: "1px solid #1a3654",
                  borderRadius: "12px",
                  color: "#f8fafc",
                  padding: "0 42px 0 16px",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
            </div>

            {/* View Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                backgroundColor: "#f59e0b",
                color: "#071524",
                border: "none",
                borderRadius: "12px",
                padding: "0 18px",
                height: "42px",
                fontWeight: 900,
                fontSize: "13.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
              }}
            >
              <ShoppingCart size={17} />
              <span>السلة ({cart.reduce((a, b) => a + b.qty, 0)})</span>
            </button>
          </div>

          {/* Categories Horizontal Carousel */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  playSound("click");
                  setActiveCategory(cat);
                }}
                style={{
                  backgroundColor: activeCategory === cat ? "#f59e0b" : "#0d2137",
                  color: activeCategory === cat ? "#071524" : "#cbd5e1",
                  border: `1px solid ${activeCategory === cat ? "#f59e0b" : "#1a3654"}`,
                  padding: "8px 18px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRODUCTS CATALOG GRID ── */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "30px 16px 80px" }}>
        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto 16px", color: "#f59e0b" }} />
            <p style={{ fontSize: "16px", fontWeight: 700 }}>جارٍ تجهيز قائمة ملوك الأسماك من السيرفر...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <p style={{ fontSize: "16px" }}>لا توجد منتجات مطابقة لبحثك</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredProducts.map(p => {
              let parsedSizes: ProductSize[] = [];
              try {
                if (p.sizes) parsedSizes = JSON.parse(p.sizes);
              } catch {}

              const isDiscounted = p.originalPrice && p.originalPrice > p.basePrice;

              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: "#0d2137",
                    border: "1px solid #1a3654",
                    borderRadius: "20px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  {/* Image Container */}
                  <div style={{ position: "relative", height: "180px", backgroundColor: "#071524" }}>
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80"}
                      alt={p.nameAr}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {isDiscounted && (
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 900,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                        }}
                      >
                        خصم خاص 🔥
                      </span>
                    )}
                    {p.isWeightItem && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          right: "12px",
                          backgroundColor: "rgba(7, 21, 36, 0.85)",
                          border: "1px solid #10b981",
                          color: "#10b981",
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Scale size={12} />
                        <span>يباع بالوزن</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    <div style={{ fontSize: "11.5px", color: "#f59e0b", fontWeight: 800 }}>
                      {p.categoryName || "فسيخ ورنجة"}
                    </div>

                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#f8fafc", lineHeight: 1.3 }}>
                      {p.nameAr}
                    </h3>

                    {p.description && (
                      <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5, flex: 1 }}>
                        {p.description}
                      </p>
                    )}

                    {/* Price and Action */}
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "12px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                        <span style={{ fontSize: "22px", fontWeight: 900, color: "#f59e0b" }}>
                          {p.basePrice}
                        </span>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          ج.م {p.isWeightItem ? "/ كجم" : ""}
                        </span>
                        {p.originalPrice && (
                          <span style={{ fontSize: "13px", color: "#64748b", textDecoration: "line-through" }}>
                            {p.originalPrice} ج.م
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => openCustomizeModal(p)}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "#071524",
                          border: "none",
                          borderRadius: "10px",
                          padding: "9px 16px",
                          fontWeight: 900,
                          fontSize: "13px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 3px 10px rgba(245, 158, 11, 0.3)",
                        }}
                      >
                        <Plus size={15} />
                        <span>طلب / تجهيز</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 5. ITEM CUSTOMIZER MODAL (Weights, Sizes, Boneless, Oil/Lemon) ── */}
      {customizingProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0d2137",
              border: "2px solid #f59e0b",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "480px",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
              color: "#f8fafc",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: "#071524",
                borderBottom: "1px solid #1a3654",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 900, color: "#f59e0b" }}>
                  تجهيز وتخصيص الطلب
                </h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                  {customizingProduct.nameAr}
                </p>
              </div>
              <button
                onClick={() => setCustomizingProduct(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "70vh", overflowY: "auto" }}>
              {/* Weight / Size Selection */}
              {customizingProduct.sizes ? (
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 800, color: "#f59e0b", marginBottom: "8px", display: "block" }}>
                    اختر الحجم أو الوزن:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {(JSON.parse(customizingProduct.sizes) as ProductSize[]).map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(s)}
                        style={{
                          backgroundColor: selectedSize?.nameAr === s.nameAr ? "#f59e0b" : "#071524",
                          color: selectedSize?.nameAr === s.nameAr ? "#071524" : "#cbd5e1",
                          border: `1px solid ${selectedSize?.nameAr === s.nameAr ? "#f59e0b" : "#1a3654"}`,
                          borderRadius: "10px",
                          padding: "10px",
                          fontSize: "12.5px",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>{s.nameAr}</span>
                        <span>{s.price} ج.م</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : customizingProduct.isWeightItem ? (
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 800, color: "#f59e0b", marginBottom: "8px", display: "block" }}>
                    اختر وزن الطلب (سعر الكيلو: {customizingProduct.basePrice} ج.م):
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {[
                      { grams: 250, label: "ربع كيلو (250 جم)" },
                      { grams: 500, label: "نصف كيلو (500 جم)" },
                      { grams: 1000, label: "1 كجم كامل" },
                    ].map(w => (
                      <button
                        key={w.grams}
                        onClick={() => setSelectedWeightGrams(w.grams)}
                        style={{
                          backgroundColor: selectedWeightGrams === w.grams ? "#f59e0b" : "#071524",
                          color: selectedWeightGrams === w.grams ? "#071524" : "#cbd5e1",
                          border: `1px solid ${selectedWeightGrams === w.grams ? "#f59e0b" : "#1a3654"}`,
                          borderRadius: "10px",
                          padding: "10px 4px",
                          fontSize: "12px",
                          fontWeight: 800,
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <div>{w.label}</div>
                        <div style={{ marginTop: "2px" }}>
                          {(customizingProduct.basePrice * w.grams) / 1000} ج.م
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Package & Cleaning Options */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 800, color: "#f59e0b", marginBottom: "8px", display: "block" }}>
                  طريقة التجهيز والتنظيف:
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    "مخلي بزيت الذرة وعصير الليمون والفلفل",
                    "سليم بالجلد متبل ومجهز",
                    "تغليف فاكيوم محكم لسفر / حفظ بالثلاجة",
                  ].map(opt => (
                    <label
                      key={opt}
                      onClick={() => setSelectedPackageType(opt)}
                      style={{
                        backgroundColor: selectedPackageType === opt ? "rgba(245, 158, 11, 0.15)" : "#071524",
                        border: `1px solid ${selectedPackageType === opt ? "#f59e0b" : "#1a3654"}`,
                        borderRadius: "10px",
                        padding: "10px 14px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{opt}</span>
                      {selectedPackageType === opt && <Check size={16} color="#f59e0b" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: "#071524",
                borderTop: "1px solid #1a3654",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>الإجمالي:</span>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#f59e0b" }}>
                  {selectedSize
                    ? selectedSize.price
                    : customizingProduct.isWeightItem
                    ? (customizingProduct.basePrice * selectedWeightGrams) / 1000
                    : customizingProduct.basePrice}{" "}
                  ج.م
                </div>
              </div>

              <button
                onClick={addCustomizedToCart}
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#071524",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
                }}
              >
                إضافة إلى السلة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. CART DRAWER ── */}
      {cartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              height: "100%",
              backgroundColor: "#0d2137",
              borderRight: "2px solid #f59e0b",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px",
                backgroundColor: "#071524",
                borderBottom: "1px solid #1a3654",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingCart size={20} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 900, color: "#f8fafc" }}>
                  سلة المشتريات
                </h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 10px", color: "#94a3b8" }}>
                  <ShoppingCart size={48} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>سلتك فارغة حالياً</p>
                  <p style={{ margin: "6px 0 0", fontSize: "12.5px" }}>اختر من أصناف الفسيخ والرنجة والبطارخ لتجربة لا تقاوم</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#071524",
                      border: "1px solid #1a3654",
                      borderRadius: "12px",
                      padding: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingLeft: "10px" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#f8fafc" }}>
                        {item.product.nameAr}
                      </div>
                      {item.selectedSize && (
                        <div style={{ fontSize: "11.5px", color: "#f59e0b", fontWeight: 700, marginTop: "2px" }}>
                          {item.selectedSize}
                        </div>
                      )}
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                        {item.unitPrice} × {item.qty} = <strong style={{ color: "#f8fafc" }}>{item.unitPrice * item.qty} ج.م</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        onClick={() => updateQty(idx, -1)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          backgroundColor: "#1a3654",
                          border: "none",
                          color: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: "13.5px", fontWeight: 900, minWidth: "18px", textAlign: "center" }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(idx, 1)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          backgroundColor: "#f59e0b",
                          border: "none",
                          color: "#071524",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Button */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#071524",
                  borderTop: "1px solid #1a3654",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#94a3b8" }}>
                  <span>المجموع الفرعي:</span>
                  <span style={{ fontWeight: 800, color: "#f8fafc" }}>{subtotal} ج.م</span>
                </div>
                {orderType === "delivery" && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#94a3b8" }}>
                    <span>خدمة التوصيل السريع:</span>
                    <span style={{ fontWeight: 800, color: "#10b981" }}>{deliveryFee} ج.م</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 900, color: "#f59e0b", borderTop: "1px dashed #1a3654", paddingTop: "8px" }}>
                  <span>الإجمالي المطلوب:</span>
                  <span>{total} ج.م</span>
                </div>

                <button
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutModalOpen(true);
                  }}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "#071524",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    fontWeight: 900,
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.4)",
                    textAlign: "center",
                  }}
                >
                  متابعة الشراء وإنهاء الطلب ({total} ج.م)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 7. CHECKOUT MODAL ── */}
      {checkoutModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0d2137",
              border: "2px solid #f59e0b",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "480px",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
              color: "#f8fafc",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: "#071524",
                borderBottom: "1px solid #1a3654",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 900, color: "#f59e0b" }}>
                  تأكيد أوردر فسيخ ورنجة الفراعنة
                </h3>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
                  الإجمالي المستحق: {total} ج.م
                </p>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckout} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Order Type Toggle */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  style={{
                    backgroundColor: orderType === "delivery" ? "#f59e0b" : "#071524",
                    color: orderType === "delivery" ? "#071524" : "#cbd5e1",
                    border: `1px solid ${orderType === "delivery" ? "#f59e0b" : "#1a3654"}`,
                    borderRadius: "8px",
                    padding: "10px",
                    fontWeight: 900,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  🛵 دليفري سريع للمنزل
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("takeaway")}
                  style={{
                    backgroundColor: orderType === "takeaway" ? "#f59e0b" : "#071524",
                    color: orderType === "takeaway" ? "#071524" : "#cbd5e1",
                    border: `1px solid ${orderType === "takeaway" ? "#f59e0b" : "#1a3654"}`,
                    borderRadius: "8px",
                    padding: "10px",
                    fontWeight: 900,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  🛍️ استلام وتجهيز من الفرع
                </button>
              </div>

              {/* Customer Name */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 800, color: "#cbd5e1", marginBottom: "4px" }}>
                  اسم المستلم *
                </label>
                <input
                  type="text"
                  required
                  placeholder="الاسم الكريم..."
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    backgroundColor: "#071524",
                    border: "1px solid #1a3654",
                    borderRadius: "10px",
                    padding: "0 12px",
                    color: "#f8fafc",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 800, color: "#cbd5e1", marginBottom: "4px" }}>
                  رقم الهاتف (للتواصل وتأكيد الطيار) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="010XXXXXXXX"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  dir="ltr"
                  style={{
                    width: "100%",
                    height: "40px",
                    backgroundColor: "#071524",
                    border: "1px solid #1a3654",
                    borderRadius: "10px",
                    padding: "0 12px",
                    color: "#f8fafc",
                    fontSize: "13px",
                    outline: "none",
                    textAlign: "right",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Address (If delivery) */}
              {orderType === "delivery" && (
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 800, color: "#cbd5e1", marginBottom: "4px" }}>
                    العنوان بالتفصيل *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="الشارع، رقم العمارة، الدور، الشقة، علامة مميزة..."
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: "#071524",
                      border: "1px solid #1a3654",
                      borderRadius: "10px",
                      padding: "0 12px",
                      color: "#f8fafc",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 800, color: "#cbd5e1", marginBottom: "6px" }}>
                  طريقة الدفع
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                  {[
                    { id: "cash", label: "كاش مع الطيار 💵" },
                    { id: "instapay", label: "إنستاباي فوري ⚡" },
                    { id: "wallet", label: "محفظة كاش 📱" },
                  ].map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        backgroundColor: paymentMethod === m.id ? "#f59e0b" : "#071524",
                        color: paymentMethod === m.id ? "#071524" : "#94a3b8",
                        border: `1px solid ${paymentMethod === m.id ? "#f59e0b" : "#1a3654"}`,
                        borderRadius: "8px",
                        padding: "8px 4px",
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <input
                  type="text"
                  placeholder="ملاحظات خاصة (زيادة ليمون، شطة، وقت معين)..."
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  style={{
                    width: "100%",
                    height: "36px",
                    backgroundColor: "#071524",
                    border: "1px solid #1a3654",
                    borderRadius: "8px",
                    padding: "0 10px",
                    color: "#f8fafc",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submittingOrder}
                style={{
                  height: "46px",
                  backgroundColor: "#f59e0b",
                  color: "#071524",
                  fontWeight: 900,
                  fontSize: "15px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: submittingOrder ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(245, 158, 11, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "6px",
                }}
              >
                {submittingOrder ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>جارٍ تأكيد الأوردر...</span>
                  </>
                ) : (
                  <span>تأكيد الطلب الآن ({total} ج.م)</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── 8. ORDER SUCCESS POPUP ── */}
      {orderSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0d2137",
              border: "2px solid #10b981",
              borderRadius: "24px",
              padding: "32px 24px",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "2px solid #10b981",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle2 size={36} color="#10b981" />
            </div>

            <h3 style={{ fontSize: "22px", fontWeight: 900, color: "#f8fafc", margin: "0 0 6px" }}>
              تم استلام أوردرك بنجاح! 🐟
            </h3>

            <p style={{ fontSize: "14px", color: "#f59e0b", fontWeight: 800, margin: "0 0 14px" }}>
              رقم الفاتورة: #{orderSuccess.orderNumber}
            </p>

            <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px" }}>
              جارٍ الآن تنظيف وتشفية وتجهيز طلبك بأعلى معايير النظافة والجودة، وسيتم تسليمه لطيار الفرع فوراً.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href={`/track?order=${orderSuccess.orderNumber}`}
                style={{
                  backgroundColor: "#10b981",
                  color: "#071524",
                  fontWeight: 900,
                  fontSize: "14px",
                  borderRadius: "10px",
                  padding: "12px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <span>تتبع حالة الأوردر والطيار لحظياً 🛵</span>
              </Link>

              <button
                onClick={() => setOrderSuccess(null)}
                style={{
                  backgroundColor: "#1a3654",
                  color: "#cbd5e1",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                العودة للتسوق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Support Floating Chat */}
      <CustomerChatWidget />
    </div>
  );
}
