import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { StaffProvider } from "@/context/StaffContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoundAlertToggle from "@/components/SoundAlertToggle";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فسيخ ورنجة الفراعنة | El-Fra3na - ملوك الأسماك المملحة والمدخنة والبطارخ",
  description: "سلسلة فروع فسيخ ورنجة الفراعنة - فسيخ بوري بلدي سوبر جامبو، رنجة هولندي خشب زان بطارخ خرز مقرمشة، بطارخ بورسعيدي ذهبية، ملوحة أسواني، وبوكسات عزومات ملوكية فاخرة جاهزة للأكل. فروعنا: فيصل، ألف مسكن، 6 أكتوبر، حدائق القبة، وزهراء المعادي.",
  icons: {
    icon: "/logo.png",
    apple: "/app-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cairo.variable}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#071524] text-[#f8fafc] antialiased selection:bg-[#f59e0b] selection:text-[#071524]"
        style={{ fontFamily: "var(--font-cairo), 'Segoe UI', Tahoma, sans-serif" }}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <StaffProvider>
            <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <Navbar />
                <main>{children}</main>
              </div>
              <Footer />
            </div>
            <SoundAlertToggle />
          </StaffProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
