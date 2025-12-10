import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXTAUTH_URL 
  ? process.env.NEXTAUTH_URL 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Git Wrapped - Seu Ano em Código",
  description: "Descubra sua atividade no GitHub estilo Spotify Wrapped. Veja seus commits, contribuições e padrões de código do ano.",
  openGraph: {
    title: "Git Wrapped - Seu Ano em Código",
    description: "Descubra sua atividade no GitHub estilo Spotify Wrapped",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Git Wrapped - Seu Ano em Código",
    description: "Descubra sua atividade no GitHub estilo Spotify Wrapped",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
