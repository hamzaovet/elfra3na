import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🐟 Seeding El-Fra3na (فسيخ ورنجة الفراعنة) Database on Neon Postgres...");

  // 1. System Settings
  await prisma.systemSettings.upsert({
    where: { id: "default" },
    update: {
      restaurantName: "فسيخ ورنجة الفراعنة",
      phone: "01000388911",
      hotlines: "01000388911 | 01069717413 | 01110022334",
      address: "الفروع: فيصل، ألف مسكن، 6 أكتوبر، حدائق القبة، زهراء المعادي",
      whatsappNumber: "01069717413",
      ownerWhatsapp: "01069717413",
      receiptHeader: "فسيخ ورنجة الفراعنة • ملوك الأسماك المملحة والمدخنة منذ 1990",
      receiptFooter: "ألف هنا وشفا • شكراً لاختياركم فسيخ ورنجة الفراعنة • دليفري وسريع: 01000388911",
      autoPrintReceipt: true,
      receiptWidth: "80mm",
      soundsEnabled: true,
      offersEnabled: true,
      openingCashBalance: 25000.0,
    },
    create: {
      id: "default",
      restaurantName: "فسيخ ورنجة الفراعنة",
      phone: "01000388911",
      hotlines: "01000388911 | 01069717413 | 01110022334",
      address: "الفروع: فيصل، ألف مسكن، 6 أكتوبر، حدائق القبة، زهراء المعادي",
      whatsappNumber: "01069717413",
      ownerWhatsapp: "01069717413",
      receiptHeader: "فسيخ ورنجة الفراعنة • ملوك الأسماك المملحة والمدخنة منذ 1990",
      receiptFooter: "ألف هنا وشفا • شكراً لاختياركم فسيخ ورنجة الفراعنة • دليفري وسريع: 01000388911",
      autoPrintReceipt: true,
      receiptWidth: "80mm",
      soundsEnabled: true,
      offersEnabled: true,
      openingCashBalance: 25000.0,
    },
  });
  console.log("✔ System Settings seeded");

  // 2. Branches
  const branches = [
    {
      name: "فرع فيصل الرئيسي (المطبعة)",
      city: "الجيزة",
      address: "شارع عمرو بن العاص، متفرع من شارع فيصل، منطقة المطبعة، برج البدر",
      phone: "01000388911",
      managerName: "الأستاذ محمود الفرعوني",
      sortOrder: 1,
    },
    {
      name: "فرع ألف مسكن (جسر السويس)",
      city: "القاهرة",
      address: "2 شارع أحمد عصمت، متفرع من جسر السويس، أمام نادي الشمس (بوابة 4)",
      phone: "01069717413",
      managerName: "الأستاذ أحمد عاصم",
      sortOrder: 2,
    },
    {
      name: "فرع 6 أكتوبر (الحصري)",
      city: "الجيزة",
      address: "ميدان الحصري، شارع مجمع الجامعة، سنتر بروج ستار، أمام سنتر شاهين",
      phone: "01110022334",
      managerName: "كابتن شريف فتحي",
      sortOrder: 3,
    },
    {
      name: "فرع حدائق القبة",
      city: "القاهرة",
      address: "شارع مصر والسودان، بجوار كوبري القبة ومحطة المترو",
      phone: "01000388911",
      managerName: "أ. طارق رضوان",
      sortOrder: 4,
    },
    {
      name: "فرع زهراء المعادي",
      city: "القاهرة",
      address: "شارع الخمسين، أمام كارفور المعادي هب، المعادي الجديدة",
      phone: "01069717413",
      managerName: "م. إسلام البدري",
      sortOrder: 5,
    },
  ];

  for (const b of branches) {
    await prisma.branch.upsert({
      where: { name: b.name },
      update: b,
      create: b,
    });
  }
  console.log("✔ Branches seeded");

  // 3. Staff & Users
  const users = [
    {
      name: "المعلم المايسترو (المالك)",
      phone: "01069717413",
      pin: "202600",
      role: "owner",
      branch: "فرع فيصل الرئيسي (المطبعة)",
      department: "الإدارة العليا والمالية",
    },
    {
      name: "مدير التشغيل العام",
      phone: "01000388911",
      pin: "112233",
      role: "manager",
      branch: "فرع فيصل الرئيسي (المطبعة)",
      department: "إدارة العمليات والفروع",
    },
    {
      name: "كاشير فيصل الصباحي",
      phone: "01110022334",
      pin: "101010",
      role: "cashier",
      branch: "فرع فيصل الرئيسي (المطبعة)",
      department: "نقطة البيع والصالة",
    },
    {
      name: "كاشير فرع ألف مسكن",
      phone: "01223344556",
      pin: "202020",
      role: "cashier",
      branch: "فرع ألف مسكن (جسر السويس)",
      department: "نقطة البيع والصالة",
    },
    {
      name: "كابتن حودة طيارة (دليفري)",
      phone: "01556677889",
      pin: "303030",
      role: "delivery",
      branch: "فرع فيصل الرئيسي (المطبعة)",
      department: "أسطول التوصيل السريع",
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { phone: u.phone },
      update: u,
      create: u,
    });
  }
  console.log("✔ Users & Staff seeded");

  // 4. Delivery Captains
  const captains = [
    {
      name: "كابتن حودة طيارة",
      phone: "01556677889",
      branch: "فرع فيصل الرئيسي (المطبعة)",
      vehicle: "سكوتر بينيلي سريع",
      isActive: true,
      totalDelivered: 142,
    },
    {
      name: "كابتن أحمد صقر",
      phone: "01099887766",
      branch: "فرع ألف مسكن (جسر السويس)",
      vehicle: "موتوسيكل دايون بوكس حراري",
      isActive: true,
      totalDelivered: 89,
    },
    {
      name: "كابتن كريم زغلول",
      phone: "01122339988",
      branch: "فرع 6 أكتوبر (الحصري)",
      vehicle: "سيارة ميني فان مكيفة للتوصيل",
      isActive: true,
      totalDelivered: 64,
    },
  ];

  for (const cap of captains) {
    await prisma.captain.upsert({
      where: { phone: cap.phone },
      update: cap,
      create: cap,
    });
  }
  console.log("✔ Delivery Captains seeded");

  // 5. Delivery Zones
  const zones = [
    { nameAr: "فيصل والعشرين وحسن محمد", nameEn: "Faisal & Hassan Mohamed", branch: "فرع فيصل الرئيسي (المطبعة)", fee: 20, timeMinutes: 30 },
    { nameAr: "شارع الهرم والمريوطية وميدان الجيزة", nameEn: "Haram & Maryouteya & Giza", branch: "فرع فيصل الرئيسي (المطبعة)", fee: 25, timeMinutes: 35 },
    { nameAr: "حدائق الأهرام وهضبة الأهرام", nameEn: "Hadayek Al-Ahram", branch: "فرع فيصل الرئيسي (المطبعة)", fee: 35, timeMinutes: 45 },
    { nameAr: "ألف مسكن ونادي الشمس وجسر السويس", nameEn: "Alf Maskan & Gesr El-Suez", branch: "فرع ألف مسكن (جسر السويس)", fee: 20, timeMinutes: 30 },
    { nameAr: "مصر الجديدة والنزهة وروكسي", nameEn: "Heliopolis & Roxy", branch: "فرع ألف مسكن (جسر السويس)", fee: 30, timeMinutes: 40 },
    { nameAr: "مدينة نصر والتجمع الخامس", nameEn: "Nasr City & New Cairo", branch: "فرع ألف مسكن (جسر السويس)", fee: 45, timeMinutes: 50 },
    { nameAr: "أكتوبر الحصري والأحياء 1-12", nameEn: "6th October Central", branch: "فرع 6 أكتوبر (الحصري)", fee: 25, timeMinutes: 35 },
    { nameAr: "حدائق أكتوبر وزايد والشيخ زايد", nameEn: "Zayed & October Gardens", branch: "فرع 6 أكتوبر (الحصري)", fee: 35, timeMinutes: 45 },
    { nameAr: "حدائق القبة والعباسية والوايلي", nameEn: "Hadayek El-Kobba", branch: "فرع حدائق القبة", fee: 25, timeMinutes: 35 },
    { nameAr: "المعادي ودجلة والزهراء", nameEn: "Maadi & Zahraa Maadi", branch: "فرع زهراء المعادي", fee: 25, timeMinutes: 35 },
  ];

  for (const z of zones) {
    const existing = await prisma.deliveryZone.findFirst({
      where: { nameAr: z.nameAr, branch: z.branch },
    });
    if (existing) {
      await prisma.deliveryZone.update({ where: { id: existing.id }, data: z });
    } else {
      await prisma.deliveryZone.create({ data: z });
    }
  }
  console.log("✔ Delivery Zones seeded");

  // 6. Categories
  const categories = [
    {
      id: "cat_feseekh",
      nameAr: "فسيخ الملوك",
      nameEn: "Royal Feseekh",
      emoji: "🐟",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      description: "فسيخ بوري بلدي فاخر نخب أول ملح خفيف زبدة دايبة",
      sortOrder: 1,
    },
    {
      id: "cat_herring",
      nameAr: "رنجة هولندي سوبر",
      nameEn: "Smoked Herring",
      emoji: "👑",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      description: "رنجة هولندي ذهبية مدخنة على خشب الزان ملح مظبوط",
      sortOrder: 2,
    },
    {
      id: "cat_bottarga",
      nameAr: "بطارخ ذهبية فاخرة",
      nameEn: "Bottarga & Caviar",
      emoji: "🥇",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      description: "بطارخ بوري بورسعيدي بلدي مجففة مغلفة شمع عسلي",
      sortOrder: 3,
    },
    {
      id: "cat_melouha",
      nameAr: "ملوحة أسواني وسردين",
      nameEn: "Aswan Melouha & Sardines",
      emoji: "🌊",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
      description: "ملوحة كلب البحر الأسواني الأصيل وسردين إسكندراني بلدي",
      sortOrder: 4,
    },
    {
      id: "cat_boxes",
      nameAr: "بوكسات العزومات والميكسات",
      nameEn: "Pharaonic Royal Boxes",
      emoji: "🎁",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      description: "صواني وبوكسات العزومات الملكية الجاهزة للأكل مباشرة",
      sortOrder: 5,
    },
    {
      id: "cat_salads",
      nameAr: "سلطات ومقبلات بحرية",
      nameEn: "Salads & Appetizers",
      emoji: "🥗",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      description: "سلطات رنجة وبطارخ وطحينة سمسم خام وليمون معصفر",
      sortOrder: 6,
    },
    {
      id: "cat_sides",
      nameAr: "عيش ومشروبات وصوصات",
      nameEn: "Bread & Beverages",
      emoji: "🥖",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      description: "خبز بلدي سخن، زيت ذرة، ليمون، ومشروبات هضم غازية",
      sortOrder: 7,
    },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log("✔ Categories seeded");

  // 7. Products
  const products = [
    // --- 1. فسيخ الملوك ---
    {
      id: "prod_feseekh_jumbo",
      nameAr: "فسيخ بوري بلدي سوبر جامبو (سليم / مخلي)",
      nameEn: "Super Jumbo Baladi Feseekh",
      categoryId: "cat_feseekh",
      categoryName: "فسيخ الملوك",
      basePrice: 480,
      originalPrice: 530,
      promoPrice: 480,
      promoDays: "كل يوم جمعة وسبت",
      promoActive: true,
      isFlashDeal: true,
      isWeightItem: true,
      scaleItemCode: "00101",
      weightUnit: "كيلو",
      sizes: JSON.stringify([
        { nameAr: "ربع كيلو (250 جم صافي)", nameEn: "250g", price: 130, weightGrams: 250 },
        { nameAr: "نصف كيلو (500 جم)", nameEn: "500g", price: 250, weightGrams: 500 },
        { nameAr: "1 كيلو كامل (سليم أو مخلي)", nameEn: "1 Kg", price: 480, weightGrams: 1000 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "مخلي بزيت الذرة وعصير الليمون", nameEn: "Boneless Oil & Lemon", price: 20 },
        { nameAr: "إضافة فلفل حار بلدي وشرائح بصل", nameEn: "Spicy Chili & Onion", price: 10 },
        { nameAr: "تغليف فاكيوم محكم لمنع الرائحة", nameEn: "Airtight Vacuum Pack", price: 15 },
      ]),
      packageType: "سليم أو مخلي بزيت وليمون",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      description: "بوري بحري أصيل طازج، ملوحة هادئة زبدة دايبة بدون أي زفارة، ينظف ويخلى عند الطلب مجاناً.",
      sortOrder: 1,
    },
    {
      id: "prod_feseekh_batarekh",
      nameAr: "فسيخ بوري بطارخ (ملوكي حبة بحبتها)",
      nameEn: "Royal Roe Feseekh",
      categoryId: "cat_feseekh",
      categoryName: "فسيخ الملوك",
      basePrice: 550,
      originalPrice: 620,
      promoPrice: 550,
      isWeightItem: true,
      scaleItemCode: "00102",
      weightUnit: "كيلو",
      sizes: JSON.stringify([
        { nameAr: "نصف كيلو (500 جم)", nameEn: "500g", price: 285, weightGrams: 500 },
        { nameAr: "1 كيلو بوري مبطرخ كامل", nameEn: "1 Kg", price: 550, weightGrams: 1000 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "تخلية مجانية وإضافة زيت سمسم", nameEn: "Boneless + Sesame Oil", price: 20 },
        { nameAr: "شطة أسواني حارة", nameEn: "Aswan Hot Chili", price: 10 },
      ]),
      packageType: "مبهر ومجهز",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      description: "سمكة بوري أنثى مبطرخة بطارخ محجرة ذهبية، من أفخر مزارع مريوط والديبة.",
      sortOrder: 2,
    },
    {
      id: "prod_feseekh_jar_half",
      nameAr: "برطمان فسيخ مخلي سوبر لوكس (نصف كيلو صافي)",
      nameEn: "Boneless Feseekh Jar 500g",
      categoryId: "cat_feseekh",
      categoryName: "فسيخ الملوك",
      basePrice: 280,
      originalPrice: 310,
      promoPrice: 280,
      isWeightItem: false,
      scaleItemCode: "00103",
      weightUnit: "برطمان",
      modifiers: JSON.stringify([
        { nameAr: "زيت ذرة نقي وشرائح ليمون إضافية", nameEn: "Extra Corn Oil & Lemon", price: 15 },
        { nameAr: "شطة سوداني حارة", nameEn: "Sudanese Chili", price: 10 },
      ]),
      packageType: "برطمان زجاجي معقم فاخر",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      description: "لحم فسيخ صافي 100% بدون شوك أو جلد أو عظم مغمور بزيت ذرة كريستال وقطع الليمون والفلفل الأخضر.",
      sortOrder: 3,
    },
    {
      id: "prod_feseekh_jar_1kg",
      nameAr: "برطمان فسيخ مخلي عائلي ملكي (1 كيلو صافي)",
      nameEn: "Family Boneless Feseekh Jar 1Kg",
      categoryId: "cat_feseekh",
      categoryName: "فسيخ الملوك",
      basePrice: 520,
      originalPrice: 590,
      promoPrice: 520,
      isWeightItem: false,
      scaleItemCode: "00104",
      weightUnit: "برطمان",
      packageType: "برطمان عائلي كبير",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      description: "كيلو لحم فسيخ بوري صافي جاهز للأكل والتقديم في العزومات بدون أي مجهود.",
      sortOrder: 4,
    },

    // --- 2. رنجة هولندي سوبر ---
    {
      id: "prod_herring_super",
      nameAr: "رنجة هولندي سوبر لوكس (مدخنة خشب زان)",
      nameEn: "Super Dutch Smoked Herring",
      categoryId: "cat_herring",
      categoryName: "رنجة هولندي سوبر",
      basePrice: 220,
      originalPrice: 250,
      promoPrice: 220,
      isWeightItem: true,
      scaleItemCode: "00201",
      weightUnit: "كيلو",
      sizes: JSON.stringify([
        { nameAr: "سمكة واحدة كبيرة (~350 جم)", nameEn: "1 Fish (~350g)", price: 80, weightGrams: 350 },
        { nameAr: "نصف كيلو رنجة (~2 سمكة)", nameEn: "500g", price: 115, weightGrams: 500 },
        { nameAr: "1 كيلو رنجة كامل (~3 سمكات)", nameEn: "1 Kg", price: 220, weightGrams: 1000 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "شوي خفيف على النار بالفرع", nameEn: "Charcoal Light Grilled", price: 10 },
        { nameAr: "تخلية كاملة في طبق فوم مع زيت وليمون", nameEn: "Deboned with Oil & Lemon", price: 15 },
      ]),
      packageType: "سليمة مدخنة أو مخلية",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      description: "رنجة هولندي نخب أول ذهبية اللون، لحم وردي متماسك قليل الملح ومدخن بعناية فائقة.",
      sortOrder: 5,
    },
    {
      id: "prod_herring_batarekh",
      nameAr: "رنجة هولندي بطارخ خرز مقرمشة",
      nameEn: "Crunchy Roe Dutch Herring",
      categoryId: "cat_herring",
      categoryName: "رنجة هولندي سوبر",
      basePrice: 290,
      originalPrice: 330,
      promoPrice: 290,
      promoActive: true,
      isFlashDeal: true,
      isWeightItem: true,
      scaleItemCode: "00202",
      weightUnit: "كيلو",
      sizes: JSON.stringify([
        { nameAr: "نصف كيلو (500 جم)", nameEn: "500g", price: 150, weightGrams: 500 },
        { nameAr: "1 كيلو كامل بطارخ خرز", nameEn: "1 Kg", price: 290, weightGrams: 1000 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "فصل البطارخ في علبة مستقلة مجاناً", nameEn: "Separate Roe Box", price: 0 },
        { nameAr: "تخلية بزيت الزيتون والليمون", nameEn: "Boneless with Olive Oil", price: 20 },
      ]),
      packageType: "طبق فوم مفرغ الهواء",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      description: "عشاق القرمشة! رنجة هولندي بطارخ خرز خشنة ممتلئة بالكامل من الرأس للذيل.",
      sortOrder: 6,
    },
    {
      id: "prod_herring_fillet_plate",
      nameAr: "طبق رنجة فيليه مخلية بزيت الذرة والطحينة (500 جم)",
      nameEn: "Boneless Herring Fillet Plate 500g",
      categoryId: "cat_herring",
      categoryName: "رنجة هولندي سوبر",
      basePrice: 150,
      originalPrice: 175,
      promoPrice: 150,
      isWeightItem: false,
      scaleItemCode: "00203",
      weightUnit: "طبق",
      modifiers: JSON.stringify([
        { nameAr: "طحينة بيضاء خام زيادة", nameEn: "Extra Tahini", price: 15 },
        { nameAr: "فلفل حار وشبت مفروم", nameEn: "Chili & Fresh Dill", price: 10 },
      ]),
      packageType: "طبق فوم شيك مع غطاء محكم",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      description: "نصف كيلو صافي من فيليه الرنجة المخلية بعناية بدون شوكة واحدة مغطاة بخلطة الليمون والزيت والطحينة.",
      sortOrder: 7,
    },
    {
      id: "prod_herring_jar_750",
      nameAr: "برطمان رنجة فيليه قطع بزيت الذرة الصافي (750 جم)",
      nameEn: "Herring Fillet Jar 750g",
      categoryId: "cat_herring",
      categoryName: "رنجة هولندي سوبر",
      basePrice: 210,
      originalPrice: 240,
      promoPrice: 210,
      isWeightItem: false,
      scaleItemCode: "00204",
      weightUnit: "برطمان",
      packageType: "برطمان زجاجي",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      description: "قطع فيليه رنجة سوبر لوكس مغمورة بزيت الذرة النقي، صالحة للحفظ بالثلاجة حتى شهرين.",
      sortOrder: 8,
    },
    {
      id: "prod_herring_grilled_mix",
      nameAr: "رنجة مشوية بالخلطة الفراعنة السرية (طبق ساخن)",
      nameEn: "Grilled Pharaonic Secret Herring Mix",
      categoryId: "cat_herring",
      categoryName: "رنجة هولندي سوبر",
      basePrice: 170,
      originalPrice: 195,
      promoPrice: 170,
      isWeightItem: false,
      scaleItemCode: "00205",
      weightUnit: "طبق",
      packageType: "طبق فويل حراري",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      description: "رنجة مشوية ومقطعة مع بصل أخضر وطماطم وفلفل ألوان وزيت ذرة وليمون إيطالي وطحينة سمسم خام.",
      sortOrder: 9,
    },

    // --- 3. بطارخ ذهبية فاخرة ---
    {
      id: "prod_bottarga_port_said",
      nameAr: "بطارخ بوري بورسعيدي بلدي مجففة مغلفة شمع عسلي",
      nameEn: "Port Said Dried Mullet Bottarga (Waxed)",
      categoryId: "cat_bottarga",
      categoryName: "بطارخ ذهبية فاخرة",
      basePrice: 1850,
      originalPrice: 2100,
      promoPrice: 1850,
      isWeightItem: true,
      scaleItemCode: "00301",
      weightUnit: "كيلو",
      sizes: JSON.stringify([
        { nameAr: "قالب بطارخ صغير (~100 جم)", nameEn: "Piece ~100g", price: 190, weightGrams: 100 },
        { nameAr: "قالب بطارخ وسط (~200 جم)", nameEn: "Piece ~200g", price: 375, weightGrams: 200 },
        { nameAr: "قالب بطارخ سوبر جامبو (~350 جم)", nameEn: "Piece ~350g", price: 650, weightGrams: 350 },
        { nameAr: "1 كيلو بطارخ شمع كامل", nameEn: "1 Kg Full Wax", price: 1850, weightGrams: 1000 },
      ]),
      packageType: "مغلفة شمع طبيعي لحفظ الجودة",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      description: "ذهب البحر! بطارخ بوري أصيلة مجففة على الطريقة البورسعيدية التراثية مغلفة بالشمع الطبيعي، تقطع شرائح مع رشة زيت زيتون وليمون.",
      sortOrder: 10,
    },
    {
      id: "prod_bottarga_herring_jar",
      nameAr: "برطمان بطارخ رنجة خرز متبلة بزيت الزيتون (350 جم)",
      nameEn: "Herring Roe in Olive Oil Jar 350g",
      categoryId: "cat_bottarga",
      categoryName: "بطارخ ذهبية فاخرة",
      basePrice: 180,
      originalPrice: 210,
      promoPrice: 180,
      isWeightItem: false,
      scaleItemCode: "00302",
      weightUnit: "برطمان",
      packageType: "برطمان زجاجي فاخر",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      description: "بطارخ رنجة مقرمشة خرز بيور بدون جلد أو هدر، متبلة بزيت الزيتون البكر وعصير الليمون والكمون.",
      sortOrder: 11,
    },
    {
      id: "prod_caviar_black_red",
      nameAr: "كافيار روسي فاخر (برطمان 120 جم)",
      nameEn: "Premium Royal Caviar 120g",
      categoryId: "cat_bottarga",
      categoryName: "بطارخ ذهبية فاخرة",
      basePrice: 160,
      originalPrice: 190,
      promoPrice: 160,
      isWeightItem: false,
      scaleItemCode: "00303",
      weightUnit: "برطمان",
      sizes: JSON.stringify([
        { nameAr: "كافيار أسود روسي فاخر (120 جم)", nameEn: "Black Caviar 120g", price: 160, weightGrams: 120 },
        { nameAr: "كافيار أحمر سلمون ملكي (120 جم)", nameEn: "Red Salmon Caviar 120g", price: 180, weightGrams: 120 },
      ]),
      packageType: "برطمان معدني / زجاجي أصلي",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      description: "حبات الكافيار الفاخرة لتزيين التوست والمقبلات والبيض المسلوق في السهرات والعزومات.",
      sortOrder: 12,
    },

    // --- 4. ملوحة أسواني وسردين ---
    {
      id: "prod_melouha_aswan",
      nameAr: "ملوحة كلب البحر الأسواني مخلية (ملوحة كلابي أصلية)",
      nameEn: "Aswan Kalb El-Bahr Melouha",
      categoryId: "cat_melouha",
      categoryName: "ملوحة أسواني وسردين",
      basePrice: 420,
      originalPrice: 460,
      promoPrice: 420,
      isWeightItem: true,
      scaleItemCode: "00401",
      weightUnit: "كيلو",
      sizes: JSON.stringify([
        { nameAr: "ربع كيلو مخلي (250 جم)", nameEn: "250g", price: 110, weightGrams: 250 },
        { nameAr: "نصف كيلو مخلي (500 جم)", nameEn: "500g", price: 215, weightGrams: 500 },
        { nameAr: "1 كيلو كلابي أسواني كامل", nameEn: "1 Kg", price: 420, weightGrams: 1000 },
      ]),
      modifiers: JSON.stringify([
        { nameAr: "تتبيل أسواني بزيت وبصل وشطة حارة", nameEn: "Aswan Spicy Dressing", price: 15 },
        { nameAr: "طحينة بيضاء خام لتهدئة الحدوقية", nameEn: "Raw White Tahini", price: 15 },
      ]),
      packageType: "طبق فوم مفرغ أو برطمان",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
      description: "ملوحة أسوانية معتقة من قلب بحيرة ناصر، سمك كلب البحر الحقيقي لحم أحمر دايب ملح بلدي مظبوط.",
      sortOrder: 13,
    },
    {
      id: "prod_sardine_baladi",
      nameAr: "سردين بلدي إسكندراني سليم بزيت وشطة",
      nameEn: "Alexandrian Baladi Sardines",
      categoryId: "cat_melouha",
      categoryName: "ملوحة أسواني وسردين",
      basePrice: 160,
      originalPrice: 180,
      promoPrice: 160,
      isWeightItem: true,
      scaleItemCode: "00402",
      weightUnit: "كيلو",
      sizes: JSON.stringify([
        { nameAr: "نصف كيلو سردين (500 جم)", nameEn: "500g", price: 85, weightGrams: 500 },
        { nameAr: "1 كيلو سردين إسكندراني", nameEn: "1 Kg", price: 160, weightGrams: 1000 },
      ]),
      packageType: "طبق فوم بزيت وليمون",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
      description: "سردين بحري بلدي طازج قشدي مخلل بالزيت والليمون والشطة الإسكندرانية اللذيذة.",
      sortOrder: 14,
    },
    {
      id: "prod_anchovy_jar",
      nameAr: "برطمان أنشوجة بلدي فيليه بالزيت والخل (250 جم)",
      nameEn: "Baladi Anchovy Fillet Jar 250g",
      categoryId: "cat_melouha",
      categoryName: "ملوحة أسواني وسردين",
      basePrice: 95,
      originalPrice: 110,
      promoPrice: 95,
      isWeightItem: false,
      scaleItemCode: "00403",
      weightUnit: "برطمان",
      packageType: "برطمان زجاجي متبل",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
      description: "فيليه أنشوجة بلدي صغيرة ناعمة متبلة بالخل الأبيض والليمون وزيت الذرة، خفيفة وسريعة للأكل.",
      sortOrder: 15,
    },

    // --- 5. بوكسات العزومات والميكسات ---
    {
      id: "prod_box_ramses",
      nameAr: "بوكس رمسيس الثاني الفاخر (عزومة 3 - 4 أفراد)",
      nameEn: "Ramses II Royal Feast Box",
      categoryId: "cat_boxes",
      categoryName: "بوكسات العزومات والميكسات",
      basePrice: 590,
      originalPrice: 680,
      promoPrice: 590,
      promoActive: true,
      isFlashDeal: true,
      isWeightItem: false,
      scaleItemCode: "00501",
      weightUnit: "بوكس",
      trayComponents: JSON.stringify([
        "نصف كيلو فسيخ بوري مخلي زبدة بزيت وليمون",
        "نصف كيلو رنجة هولندي فيليه مدخنة بدون شوك",
        "برطمان بطارخ رنجة خرز متبلة (150 جم)",
        "2 علبة سلطة طحينة سمسم خام",
        "طبق ليمون معصفر وفلفل بلدي مخلل",
        "10 أرغفة عيش بلدي سخن + حزمة بصل أخضر وجرجير",
      ]),
      packageType: "بوكس كرتوني فاخر شيك جداً",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      description: "البوكس الأكثر مبيعاً في الأعياد والمناسبات! كل اللي تحتاجه في عزومة متكاملة بدون أي تعب تنظيف أو تقطيع.",
      sortOrder: 16,
    },
    {
      id: "prod_box_nefertiti",
      nameAr: "بوكس نفرتيتي الملكي (عزومة 5 - 7 أفراد)",
      nameEn: "Nefertiti Grand Feast Box",
      categoryId: "cat_boxes",
      categoryName: "بوكسات العزومات والميكسات",
      basePrice: 980,
      originalPrice: 1150,
      promoPrice: 980,
      promoActive: true,
      isFlashDeal: true,
      isWeightItem: false,
      scaleItemCode: "00502",
      weightUnit: "بوكس",
      trayComponents: JSON.stringify([
        "1 كيلو فسيخ بوري سوبر جامبو مخلي",
        "1 كيلو رنجة هولندي بطارخ خرز مخلية ومتبلة",
        "نصف كيلو ملوحة أسواني كلابي مخلية بزيت وليمون",
        "برطمان بطارخ بوري بورسعيدي شرائح (200 جم)",
        "4 أطباق سلطات مشكلة (رنجة مطحونة، طحينة، مخلل، ليمون معصفر)",
        "20 رغيف عيش بلدي + باقة خضروات كاملة",
      ]),
      packageType: "بوكس هدايا ملكي كبير",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      description: "عزومة تليق بالملوك! تشكيلة واسعة من أجود أنواع الأسماك المملحة والمدخنة والبطارخ لجمع الأحباب.",
      sortOrder: 17,
    },
    {
      id: "prod_box_solo",
      nameAr: "بوكس السعادة الفردي (وجبة شخص واحد)",
      nameEn: "Solo Happiness Meal Box",
      categoryId: "cat_boxes",
      categoryName: "بوكسات العزومات والميكسات",
      basePrice: 220,
      originalPrice: 250,
      promoPrice: 220,
      isWeightItem: false,
      scaleItemCode: "00503",
      weightUnit: "بوكس",
      trayComponents: JSON.stringify([
        "طبق فسيخ مخلي بزيت وليمون (200 جم)",
        "طبق رنجة مخلية فيليه (200 جم)",
        "علبة سلطة طحينة صغيرة + ليمونة وفلفل حار",
        "4 أرغفة عيش بلدي سخن",
        "كانز مياه غازية هضم حسب الاختيار",
      ]),
      packageType: "بوكس وجبة فردية مفرغ",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      description: "نفسك هفاك على فسيخ ورنجة ومحدش في البيت معاك؟ وجبتك الفردية المتكاملة المخلية جاهزة فوراً بالعيش والكانز.",
      sortOrder: 18,
    },

    // --- 6. سلطات ومقبلات بحرية ---
    {
      id: "prod_salad_herring_tahini",
      nameAr: "سلطة رنجة مطحونة بالطحينة الخام والليمون (300 جم)",
      nameEn: "Mashed Herring Salad with Raw Tahini 300g",
      categoryId: "cat_salads",
      categoryName: "سلطات ومقبلات بحرية",
      basePrice: 75,
      originalPrice: 90,
      promoPrice: 75,
      isWeightItem: false,
      scaleItemCode: "00601",
      weightUnit: "طبق",
      packageType: "علبة ميكروويف محكمة",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      description: "رنجة فيليه مطحونة ناعم مع طحينة سمسم بلدي، كمون، شطة خفيفة، وليمون معصور طازج.",
      sortOrder: 19,
    },
    {
      id: "prod_salad_tahini_raw",
      nameAr: "طحينة سمسم بلدي خام مخصوص للفسيخ (نصف كيلو)",
      nameEn: "Pure Baladi Sesame Tahini 500g",
      categoryId: "cat_salads",
      categoryName: "سلطات ومقبلات بحرية",
      basePrice: 65,
      isWeightItem: false,
      scaleItemCode: "00602",
      weightUnit: "علبة",
      packageType: "برطمان بلاستيك غذائي",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      description: "طحينة بيضاء سمسم بلدي صافي 100% بدون أي إضافات دقيق، السر في طعم سفرة الفراعنة.",
      sortOrder: 20,
    },
    {
      id: "prod_pickles_lemon",
      nameAr: "ليمون معصفر بحبة البركة وفلفل مخلل بلدي (طبق)",
      nameEn: "Pickled Lemon with Nigella & Green Chili",
      categoryId: "cat_salads",
      categoryName: "سلطات ومقبلات بحرية",
      basePrice: 40,
      isWeightItem: false,
      scaleItemCode: "00603",
      weightUnit: "طبق",
      packageType: "علبة محكمة",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      description: "ليمون بلدي معصفر ومتبل بالعصفر وحبة البركة وزيت الزيتون مع فلفل بلدي حراق.",
      sortOrder: 21,
    },

    // --- 7. عيش ومشروبات وصوصات ---
    {
      id: "prod_baladi_bread",
      nameAr: "باكت عيش بلدي سخن ردة وطازج (10 أرغفة)",
      nameEn: "Fresh Egyptian Baladi Bread (10 Loaves)",
      categoryId: "cat_sides",
      categoryName: "عيش ومشروبات وصوصات",
      basePrice: 20,
      isWeightItem: false,
      scaleItemCode: "00701",
      weightUnit: "باكت",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      description: "عيش بلدي طازة سخن بالردة من الفرن مباشرة ليكمل أحلى لقمة فسيخ ورنجة.",
      sortOrder: 22,
    },
    {
      id: "prod_soda_can",
      nameAr: "كانز مشروب غازي هضم (سفن أب / شويبس ليمون / بيبسي)",
      nameEn: "Soft Drink Can 330ml",
      categoryId: "cat_sides",
      categoryName: "عيش ومشروبات وصوصات",
      basePrice: 20,
      isWeightItem: false,
      scaleItemCode: "00702",
      weightUnit: "كانز",
      sizes: JSON.stringify([
        { nameAr: "7up سفن أب ليمون (الأفضل للهضم)", nameEn: "7up Can", price: 20 },
        { nameAr: "شويبس ليمون ونعناع مثلج", nameEn: "Schweppes Lemon Mint", price: 20 },
        { nameAr: "بيبسي كولا مثلج", nameEn: "Pepsi Can", price: 20 },
      ]),
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
      description: "مشروبات غازية باردة مثلجة للمساعدة على الهضم والانتعاش بعد الوجبة.",
      sortOrder: 23,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log("✔ Products seeded (23 Authentic Pharaonic Seafood Products)");

  // 8. Sample Treasury & Initial Opening Balance
  await prisma.treasuryTransaction.create({
    data: {
      type: "IN",
      category: "OPENING",
      amount: 25000.0,
      description: "رصيد افتتاح الخزينة النقدية لبداية تشغيل فروع فسيخ ورنجة الفراعنة",
      branch: "فرع فيصل الرئيسي (المطبعة)",
      createdBy: "المعلم المايسترو (المالك)",
      paymentMethod: "cash",
    },
  });
  console.log("✔ Initial Treasury Balance seeded");

  console.log("🎉 Seeding Completed Successfully for El-Fra3na (فسيخ ورنجة الفراعنة)!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
