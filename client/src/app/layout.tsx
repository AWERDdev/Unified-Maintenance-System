import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const generateMetadata = async  () =>{
  const cookieStore = await cookies()
  const lang = cookieStore.get("lang")?.value || "en"

  return{
    title:lang === "ar"
    ?"منظومة بلاغات الصيانة الموحدة"
    :"Unified Maintenance Escalation System",
    description:lang === "ar"
    ? "إنشاء كيرلس رامي جرجس" 
    : "Created by Kirlous Rami Gerges",
  }

}

export default async function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const lang = cookieStore.get("lang")?.value || "en"
  const isRTL = lang === "ar";

  return (
    <html
      lang={lang}
      dir={isRTL?"rtl":"ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
