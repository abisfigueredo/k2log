import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { CircularNav } from "../components/CircularNav";
import { Footer } from "../components/Footer";

const caughe = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caughe",
  display: "swap",
});

const visby = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-visby",
  display: "swap",
});

export const metadata = {
  title: "K2Log — Key to Log | Aceite corporal natural",
  description:
    "Cuidado corporal y belleza natural. Aceite corporal multifuncional con aceites 100% naturales.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${caughe.variable} ${visby.variable}`}>
      <body className="min-h-dvh antialiased font-sans">
        <CircularNav />
        <div className="flex min-h-dvh flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
