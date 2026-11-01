"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStaff } from "@/context/StaffContext";
import { useLanguage } from "@/context/LanguageContext";
import { playSound } from "@/lib/sounds";
import {
  RefreshCw, Search, Loader2, ShoppingBag, Printer,
  Store, Trash2, X, ChevronLeft, ChevronRight, Plus, Minus,
  Scale, CheckCircle2, User, Phone, MapPin, Tag, Flame
} from "lucide-react";
import Link from "next/link";
import ErpLayout from "@/components/ErpLayout";
import { ALL_DELIVERY_ZONES, ZoneItem, DEFAULT_ZONE } from "@/lib/zones";
import { printThermalReceipt, PrintableOrder } from "@/components/ThermalReceipt";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address?: string | null;
  zone?: string | null;
  branch?: string | null;
  orderType?: "delivery" | "takeaway" | "pos" | "dinein" | string;
  status: string;
  items: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  notes?: string | null;
  cashierName?: string | null;
  createdAt: string;
}

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
  categoryName?: string | null;
  basePrice: number;
  originalPrice?: number | null;
  promoPrice?: number | null;
  isWeightItem?: boolean;
  scaleItemCode?: string | null;
  weightUnit?: string | null;
  image?: string | null;
  sizes?: string | null;
  modifiers?: string | null;
}

interface TicketItem {
  product: Product;
  qty: number;
  variantName?: string | null;
  unitPrice: number;
  weightGrams?: number;
  packageType?: string;
  extras?: string[];
}

export default function CashierPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, loading: authLoading } = useStaff();

  const [activeMainTab, setActiveMainTab] = useState<"pos" | "history">("pos");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [lastPrintedOrder, setLastPrintedOrder] = useState<PrintableOrder | null>(null);

  // POS Ticket State
  const [ticketOrderType, setTicketOrderType] = useState<"pos" | "takeaway" | "delivery">("pos");
  const [ticketItems, setTicketItems] = useState<TicketItem[]>([]);
  const [ticketCustomerName, setTicketCustomerName] = useState("عميل صالة");
  const [ticketCustomerPhone, setTicketCustomerPhone] = useState("01000000000");
  const [ticketAddress, setTicketAddress] = useState("");
  const [ticketSelectedZone, setTicketSelectedZone] = useState<ZoneItem>(DEFAULT_ZONE);
  const [ticketPaymentMethod, setTicketPaymentMethod] = useState("cash");
  const [ticketNotes, setTicketNotes] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [menuSearchQuery, setMenuSearchQuery] = useState("");

  // Weight/Custom modal state for an item
  const [selectedWeightProduct, setSelectedWeightProduct] = useState<Product | null>(null);
  const [customGrams, setCustomGrams] = useState(500);

  const fetchProductsAndOrders = useCallback(async () => {
    try {
      setLoading(true);
      const [resProd, resOrd] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders?limit=30"),
      ]);

      if (resProd.ok) {
        const prodData: Product[] = await resProd.json();
        setProducts(prodData);
        const uniqueCats = Array.from(new Set(prodData.map(p => p.categoryName || "أخرى"))).filter(Boolean);
        setCategories(["الكل", ...uniqueCats]);
      }

      if (resOrd.ok) {
        const ordData: Order[] = await resOrd.json();
        setOrders(ordData);
      }
    } catch (err) {
      console.error("Cashier fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsAndOrders();
  }, [fetchProductsAndOrders]);

  // Add Item to ticket
  function addItemToTicket(product: Product, size?: ProductSize, grams?: number) {
    playSound("pop");
    let unitPrice = product.basePrice;
    let variantName = "";
    let itemGrams = 1000;

    if (size) {
      unitPrice = size.price;
      variantName = size.nameAr;
      itemGrams = size.weightGrams || 500;
    } else if (grams && product.isWeightItem) {
      unitPrice = (product.basePrice * grams) / 1000;
      variantName = `${grams} جم (وزن ميزان)`;
      itemGrams = grams;
    }

    setTicketItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === product.id && i.variantName === variantName
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].qty += 1;
        return next;
      }
      return [
        ...prev,
        {
          product,
          qty: 1,
          variantName,
          unitPrice,
          weightGrams: itemGrams,
        },
      ];
    });
  }

  function updateItemQty(index: number, delta: number) {
    playSound("click");
    setTicketItems(prev => {
      const next = [...prev];
      const newQty = next[index].qty + delta;
      if (newQty <= 0) {
        return next.filter((_, idx) => idx !== index);
      }
      next[index].qty = newQty;
      return next;
    });
  }

  function removeItem(index: number) {
    playSound("trash");
    setTicketItems(prev => prev.filter((_, idx) => idx !== index));
  }

  function clearTicket() {
    playSound("trash");
    setTicketItems([]);
    setTicketCustomerName(ticketOrderType === "pos" ? "عميل صالة" : "");
    setTicketCustomerPhone(ticketOrderType === "pos" ? "01000000000" : "");
    setTicketAddress("");
    setTicketNotes("");
  }

  // Calculations
  const subtotal = ticketItems.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);
  const deliveryFee = ticketOrderType === "delivery" ? ticketSelectedZone.fee : 0;
  const total = subtotal + deliveryFee;

  // Submit Order
  async function handleSubmitOrder() {
    if (ticketItems.length === 0) {
      alert("يرجى اختيار صنف واحد على الأقل قبل حفظ الفاتورة");
      return;
    }

    try {
      setSubmittingOrder(true);
      playSound("order");

      const itemsPayload = ticketItems.map(item => ({
        productId: item.product.id,
        nameAr: item.product.nameAr,
        nameEn: item.product.nameEn,
        qty: item.qty,
        unitPrice: item.unitPrice,
        selectedSize: item.variantName || undefined,
        packageType: item.product.isWeightItem ? "موزون ومعبأ" : "جاهز",
        total: item.unitPrice * item.qty,
      }));

      const branchName = currentUser?.branch || "فرع فيصل الرئيسي (المطبعة)";

      const payload = {
        customerName: ticketCustomerName.trim() || (ticketOrderType === "pos" ? "عميل صالة" : "عميل كريم"),
        phone: ticketCustomerPhone.trim() || "01000000000",
        address: ticketOrderType === "delivery" ? ticketAddress.trim() : null,
        zone: ticketOrderType === "delivery" ? ticketSelectedZone.nameAr : "داخل المحل",
        branch: branchName,
        orderType: ticketOrderType,
        status: ticketOrderType === "pos" ? "delivered" : "new",
        items: JSON.stringify(itemsPayload),
        subtotal,
        deliveryFee,
        total,
        paymentMethod: ticketPaymentMethod,
        notes: ticketNotes.trim() || null,
        cashierName: currentUser?.name || "كاشير الصالة",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("فشل إصدار الفاتورة");
      }

      const createdOrder: Order = await res.json();
      setOrders(prev => [createdOrder, ...prev]);

      // Print thermal receipt directly
      const printable: PrintableOrder = {
        id: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        customerName: createdOrder.customerName,
        phone: createdOrder.phone,
        address: createdOrder.address,
        zone: createdOrder.zone,
        branch: createdOrder.branch,
        orderType: createdOrder.orderType,
        status: createdOrder.status,
        items: createdOrder.items,
        subtotal: createdOrder.subtotal,
        deliveryFee: createdOrder.deliveryFee,
        total: createdOrder.total,
        paymentMethod: createdOrder.paymentMethod,
        notes: createdOrder.notes,
        cashierName: createdOrder.cashierName,
        createdAt: createdOrder.createdAt,
      };

      printThermalReceipt(printable);
      setLastPrintedOrder(printable);
      clearTicket();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء إصدار الفاتورة");
    } finally {
      setSubmittingOrder(false);
    }
  }

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === "الكل" || (p.categoryName === activeCategory);
    const matchesSearch = !menuSearchQuery ||
      p.nameAr.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
      (p.scaleItemCode && p.scaleItemCode.includes(menuSearchQuery));
    return matchesCat && matchesSearch;
  });

  return (
    <ErpLayout activeItem="cashier">
      <div style={{
        display: "flex",
        height: "calc(100vh - 60px)",
        overflow: "hidden",
        backgroundColor: "#071524",
        color: "#f8fafc",
        fontFamily: "var(--font-cairo), sans-serif",
        direction: "rtl",
      }}>

        {/* LEFT / CENTER: Products Grid & Quick POS Catalog */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          borderLeft: "2px solid #1a3654",
          backgroundColor: "#071524",
        }}>

          {/* Top Bar: Search, Category Pills, Quick Filter */}
          <div style={{
            padding: "16px 20px",
            backgroundColor: "#0d2137",
            borderBottom: "1px solid #1a3654",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={18} style={{ position: "absolute", right: "12px", top: "11px", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو كود الميزان PLU (مثال: فسيخ، 00101)..."
                  value={menuSearchQuery}
                  onChange={e => setMenuSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#071524",
                    border: "1px solid #1a3654",
                    color: "#f8fafc",
                    padding: "0 40px 0 14px",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setActiveMainTab("pos")}
                  style={{
                    backgroundColor: activeMainTab === "pos" ? "#f59e0b" : "#1a3654",
                    color: activeMainTab === "pos" ? "#071524" : "#cbd5e1",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  شاشة البيع
                </button>
                <button
                  onClick={() => setActiveMainTab("history")}
                  style={{
                    backgroundColor: activeMainTab === "history" ? "#f59e0b" : "#1a3654",
                    color: activeMainTab === "history" ? "#071524" : "#cbd5e1",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  سجل فواتير اليوم ({orders.length})
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    playSound("click");
                    setActiveCategory(cat);
                  }}
                  style={{
                    backgroundColor: activeCategory === cat ? "#f59e0b" : "#071524",
                    color: activeCategory === cat ? "#071524" : "#cbd5e1",
                    border: `1px solid ${activeCategory === cat ? "#f59e0b" : "#1a3654"}`,
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "12.5px",
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

          {/* Main Area: Catalog or History */}
          {activeMainTab === "pos" ? (
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: "16px",
              alignContent: "start",
            }}>
              {loading ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "#f59e0b" }} />
                  <p>جارٍ تحميل أصناف الفسيخ والرنجة والأسماك...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                  <p>لا توجد أصناف مطابقة للبحث</p>
                </div>
              ) : (
                filteredProducts.map(p => {
                  let parsedSizes: ProductSize[] = [];
                  try {
                    if (p.sizes) parsedSizes = JSON.parse(p.sizes);
                  } catch {}

                  return (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: "#0d2137",
                        border: "1px solid #1a3654",
                        borderRadius: "16px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.15s, border-color 0.15s",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      {/* Image / Header */}
                      <div style={{ position: "relative", height: "120px", backgroundColor: "#071524" }}>
                        <img
                          src={p.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"}
                          alt={p.nameAr}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {p.scaleItemCode && (
                          <span style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "rgba(7, 21, 36, 0.85)",
                            border: "1px solid #f59e0b",
                            color: "#f59e0b",
                            fontSize: "10px",
                            fontWeight: 900,
                            padding: "2px 6px",
                            borderRadius: "6px",
                            direction: "ltr",
                          }}>
                            PLU: {p.scaleItemCode}
                          </span>
                        )}
                        {p.isWeightItem && (
                          <span style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            backgroundColor: "rgba(16, 185, 129, 0.9)",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}>
                            <Scale size={11} />
                            <span>بالوزن</span>
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#f8fafc", lineHeight: 1.3 }}>
                          {p.nameAr}
                        </h4>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "auto" }}>
                          <span style={{ fontSize: "17px", fontWeight: 900, color: "#f59e0b" }}>
                            {p.basePrice}
                          </span>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                            ج.م {p.isWeightItem ? "/ كجم" : ""}
                          </span>
                        </div>

                        {/* Size / Weight Quick Buttons */}
                        {parsedSizes.length > 0 ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px", marginTop: "4px" }}>
                            {parsedSizes.map((s, idx) => (
                              <button
                                key={idx}
                                onClick={() => addItemToTicket(p, s)}
                                style={{
                                  backgroundColor: "#071524",
                                  border: "1px solid #1a3654",
                                  borderRadius: "8px",
                                  padding: "6px 4px",
                                  color: "#cbd5e1",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "2px",
                                }}
                              >
                                <span>{s.nameAr}</span>
                                <span style={{ color: "#f59e0b", fontWeight: 800 }}>{s.price} ج.م</span>
                              </button>
                            ))}
                          </div>
                        ) : p.isWeightItem ? (
                          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                            <button
                              onClick={() => addItemToTicket(p, undefined, 250)}
                              style={{
                                flex: 1,
                                backgroundColor: "#071524",
                                border: "1px solid #1a3654",
                                borderRadius: "6px",
                                padding: "6px 2px",
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "#cbd5e1",
                                cursor: "pointer",
                              }}
                            >
                              250 جم
                            </button>
                            <button
                              onClick={() => addItemToTicket(p, undefined, 500)}
                              style={{
                                flex: 1,
                                backgroundColor: "#071524",
                                border: "1px solid #1a3654",
                                borderRadius: "6px",
                                padding: "6px 2px",
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "#cbd5e1",
                                cursor: "pointer",
                              }}
                            >
                              500 جم
                            </button>
                            <button
                              onClick={() => addItemToTicket(p, undefined, 1000)}
                              style={{
                                flex: 1,
                                backgroundColor: "#f59e0b",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 2px",
                                fontSize: "11px",
                                fontWeight: 900,
                                color: "#071524",
                                cursor: "pointer",
                              }}
                            >
                              1 كجم
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItemToTicket(p)}
                            style={{
                              backgroundColor: "#f59e0b",
                              border: "none",
                              borderRadius: "8px",
                              padding: "8px",
                              color: "#071524",
                              fontWeight: 900,
                              fontSize: "12.5px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              marginTop: "4px",
                            }}
                          >
                            <Plus size={14} />
                            <span>إضافة للفاتورة</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* History Tab */
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0d2137", borderBottom: "2px solid #1a3654", color: "#f59e0b" }}>
                    <th style={{ padding: "12px", textAlign: "right" }}>رقم الفاتورة</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>العميل والهاتف</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>النوع</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>طريقة الدفع</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>الإجمالي</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>طباعة</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(ord => (
                    <tr key={ord.id} style={{ borderBottom: "1px solid #1a3654" }}>
                      <td style={{ padding: "12px", fontWeight: 800 }}>{ord.orderNumber}</td>
                      <td style={{ padding: "12px" }}>
                        <div>{ord.customerName}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }} dir="ltr">{ord.phone}</div>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{
                          backgroundColor: ord.orderType === "pos" ? "#10b98122" : "#f59e0b22",
                          color: ord.orderType === "pos" ? "#10b981" : "#f59e0b",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800,
                        }}>
                          {ord.orderType === "pos" ? "صالة مباشر" : ord.orderType === "takeaway" ? "تيك أواي" : "دليفري"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>{ord.paymentMethod}</td>
                      <td style={{ padding: "12px", textAlign: "left", fontWeight: 900, color: "#f59e0b" }}>
                        {ord.total} ج.م
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => {
                            const p: PrintableOrder = {
                              id: ord.id,
                              orderNumber: ord.orderNumber,
                              customerName: ord.customerName,
                              phone: ord.phone,
                              address: ord.address,
                              zone: ord.zone,
                              branch: ord.branch,
                              orderType: ord.orderType,
                              status: ord.status,
                              items: ord.items,
                              subtotal: ord.subtotal,
                              deliveryFee: ord.deliveryFee,
                              total: ord.total,
                              paymentMethod: ord.paymentMethod,
                              notes: ord.notes,
                              cashierName: ord.cashierName,
                              createdAt: ord.createdAt,
                            };
                            printThermalReceipt(p);
                          }}
                          style={{
                            backgroundColor: "#1a3654",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            color: "#cbd5e1",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          <Printer size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT: Active POS Ticket & Payment Panel */}
        <div style={{
          width: "380px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0d2137",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.3)",
        }}>

          {/* Ticket Header */}
          <div style={{
            padding: "16px 20px",
            backgroundColor: "#071524",
            borderBottom: "1px solid #1a3654",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#f59e0b" }}>
                فاتورة البيع الحالية
              </h3>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                {currentUser?.branch || "فرع فيصل الرئيسي"} • الكاشير: {currentUser?.name?.split(" ")[0]}
              </p>
            </div>
            {ticketItems.length > 0 && (
              <button
                onClick={clearTicket}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Trash2 size={13} />
                <span>مسح الكل</span>
              </button>
            )}
          </div>

          {/* Order Type Selector */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid #1a3654",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}>
            {[
              { id: "pos", label: "صالة المحل" },
              { id: "takeaway", label: "تيك أواي" },
              { id: "delivery", label: "دليفري" },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => {
                  playSound("click");
                  setTicketOrderType(type.id as any);
                }}
                style={{
                  backgroundColor: ticketOrderType === type.id ? "#f59e0b" : "#071524",
                  color: ticketOrderType === type.id ? "#071524" : "#cbd5e1",
                  border: `1px solid ${ticketOrderType === type.id ? "#f59e0b" : "#1a3654"}`,
                  borderRadius: "8px",
                  padding: "8px 4px",
                  fontWeight: 900,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Customer Details Inputs (if Delivery or Takeaway) */}
          {ticketOrderType !== "pos" && (
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a3654", display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                type="text"
                placeholder="اسم العميل..."
                value={ticketCustomerName}
                onChange={e => setTicketCustomerName(e.target.value)}
                style={{
                  height: "34px",
                  borderRadius: "8px",
                  backgroundColor: "#071524",
                  border: "1px solid #1a3654",
                  color: "#f8fafc",
                  padding: "0 10px",
                  fontSize: "12px",
                  outline: "none",
                }}
              />
              <input
                type="text"
                placeholder="رقم الهاتف (للتوصيل والمتابعة)..."
                value={ticketCustomerPhone}
                onChange={e => setTicketCustomerPhone(e.target.value)}
                dir="ltr"
                style={{
                  height: "34px",
                  borderRadius: "8px",
                  backgroundColor: "#071524",
                  border: "1px solid #1a3654",
                  color: "#f8fafc",
                  padding: "0 10px",
                  fontSize: "12px",
                  outline: "none",
                  textAlign: "right",
                }}
              />
              {ticketOrderType === "delivery" && (
                <>
                  <input
                    type="text"
                    placeholder="العنوان بالتفصيل (العمارة، الشقة)..."
                    value={ticketAddress}
                    onChange={e => setTicketAddress(e.target.value)}
                    style={{
                      height: "34px",
                      borderRadius: "8px",
                      backgroundColor: "#071524",
                      border: "1px solid #1a3654",
                      color: "#f8fafc",
                      padding: "0 10px",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                  <select
                    value={ticketSelectedZone.code}
                    onChange={e => {
                      const z = ALL_DELIVERY_ZONES.find(x => x.code === e.target.value);
                      if (z) setTicketSelectedZone(z);
                    }}
                    style={{
                      height: "34px",
                      borderRadius: "8px",
                      backgroundColor: "#071524",
                      border: "1px solid #1a3654",
                      color: "#f59e0b",
                      padding: "0 8px",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  >
                    {ALL_DELIVERY_ZONES.map(z => (
                      <option key={z.code} value={z.code}>
                        {z.nameAr} ({z.fee} ج.م)
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}

          {/* Ticket Items List */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            {ticketItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 10px", color: "#94a3b8" }}>
                <ShoppingBag size={42} style={{ margin: "0 auto 10px", opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: "13px" }}>الفاتورة فارغة</p>
                <p style={{ margin: "4px 0 0", fontSize: "11px" }}>اختر الأصناف من القائمة لإضافتها</p>
              </div>
            ) : (
              ticketItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#071524",
                    border: "1px solid #1a3654",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingLeft: "8px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.product.nameAr}
                    </div>
                    {item.variantName && (
                      <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 700 }}>
                        {item.variantName}
                      </div>
                    )}
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                      {item.unitPrice} × {item.qty} = <strong style={{ color: "#f8fafc" }}>{item.unitPrice * item.qty} ج.م</strong>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      onClick={() => updateItemQty(idx, -1)}
                      style={{
                        width: "26px",
                        height: "26px",
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
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: "13px", fontWeight: 900, minWidth: "16px", textAlign: "center" }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateItemQty(idx, 1)}
                      style={{
                        width: "26px",
                        height: "26px",
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
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div style={{
            padding: "10px 16px",
            backgroundColor: "#071524",
            borderTop: "1px solid #1a3654",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "6px",
          }}>
            {[
              { id: "cash", label: "كاش 💵" },
              { id: "instapay", label: "إنستا ⚡" },
              { id: "card", label: "فيزا 💳" },
              { id: "wallet", label: "محفظة 📱" },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setTicketPaymentMethod(m.id)}
                style={{
                  backgroundColor: ticketPaymentMethod === m.id ? "#f59e0b" : "#0d2137",
                  color: ticketPaymentMethod === m.id ? "#071524" : "#94a3b8",
                  border: `1px solid ${ticketPaymentMethod === m.id ? "#f59e0b" : "#1a3654"}`,
                  borderRadius: "6px",
                  padding: "6px 2px",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Totals & Submit Order Button */}
          <div style={{
            padding: "16px 20px",
            backgroundColor: "#071524",
            borderTop: "1px solid #1a3654",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#94a3b8" }}>
              <span>المجموع الفرعي:</span>
              <span style={{ fontWeight: 800, color: "#f8fafc" }}>{subtotal} ج.م</span>
            </div>
            {ticketOrderType === "delivery" && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#94a3b8" }}>
                <span>خدمة الدليفري:</span>
                <span style={{ fontWeight: 800, color: "#f8fafc" }}>{deliveryFee} ج.م</span>
              </div>
            )}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "17px",
              fontWeight: 900,
              color: "#f59e0b",
              paddingTop: "6px",
              borderTop: "1px dashed #1a3654",
            }}>
              <span>المبلغ المستحق:</span>
              <span>{total} ج.م</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={submittingOrder || ticketItems.length === 0}
              style={{
                width: "100%",
                backgroundColor: ticketItems.length === 0 ? "#1a3654" : "#f59e0b",
                color: ticketItems.length === 0 ? "#64748b" : "#071524",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                fontWeight: 900,
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: ticketItems.length === 0 ? "not-allowed" : "pointer",
                boxShadow: ticketItems.length === 0 ? "none" : "0 4px 16px rgba(245, 158, 11, 0.4)",
              }}
            >
              {submittingOrder ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>جارٍ الحفظ والطباعة...</span>
                </>
              ) : (
                <>
                  <Printer size={18} />
                  <span>حفظ وإصدار الفاتورة فوراً</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ErpLayout>
  );
}
