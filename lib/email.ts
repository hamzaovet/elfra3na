import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.EMAIL_USER || "hamzaovet@gmail.com";
  const rawPass = process.env.EMAIL_PASS || "";
  const pass = rawPass.replace(/\s+/g, "");

  if (!pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

export async function sendOtpEmail(to: string, name: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("⚠️ [Email] EMAIL_PASS not configured in environment. Test code:", code);
      return { success: true };
    }

    const fromAddress = `"فسيخ ورنجة الفراعنة 🐟" <${process.env.EMAIL_USER || "hamzaovet@gmail.com"}>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Cairo', system-ui, -apple-system, sans-serif; background-color: #071524; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #0d2137; border: 2px solid #f59e0b; border-radius: 24px; padding: 36px 28px; text-align: center; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4); }
          .logo { color: #f59e0b; font-size: 28px; font-weight: 900; margin-bottom: 6px; }
          .sub { color: #94a3b8; font-size: 13px; margin-bottom: 24px; font-weight: 700; }
          .otp-box { background: #071524; border: 2px dashed #f59e0b; border-radius: 16px; padding: 18px; margin: 24px 0; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #f59e0b; font-family: monospace; }
          .info { color: #cbd5e1; font-size: 13px; line-height: 1.6; }
          .footer { margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #1a3654; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🐟 فسيخ ورنجة الفراعنة</div>
          <div class="sub">ملوك الأسماك المملحة والمدخنة والبطارخ منذ 1990</div>
          
          <h2 style="color: #f8fafc; font-size: 20px; margin: 0 0 10px 0;">أهلاً بك يا ${name || "عميلنا العزيز"} 👋</h2>
          <p class="info">استخدم كود التحقق السري التالي لتأكيد تسجيل حسابك في التطبيق:</p>

          <div class="otp-box">${code}</div>

          <p class="info">⚠️ هذا الرمز صالح لمدة 10 دقائق فقط. لا تشارك هذا الرمز مع أي شخص.</p>

          <div class="footer">
            تم إرسال هذا البريد آلياً من منصة فسيخ ورنجة الفراعنة السحابية<br/>
            الخط الساخن والدليفري السريع: 01000388911 | 01069717413
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `كود التحقق الخاص بك في فسيخ ورنجة الفراعنة 🐟: ${code}`,
      html: htmlContent,
    });

    return { success: true };
  } catch (err: any) {
    console.error("❌ [Email Error]:", err);
    return { success: false, error: err.message };
  }
}
