import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "إبداع - منصة المستقبل للمبدعين العرب",
  description: "منصة المبدعين الأولى في العالم العربي , حيث يلتقي الإبداع بالتكنولوجيا لبناء مستقبل أفضل",
};

export default function RootLayout({ children }) {
  return (
    <html className="mdl-js" dir="rtl" lang="ar">
      <body className={inter.className} >
        <QueryProvider>
          <Toaster richColors position="top-center" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
