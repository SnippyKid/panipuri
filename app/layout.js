import { Fredoka, Nunito, Pacifico } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata = {
  title: "Pani Puri Experience",
  description: "The most fun pani puri experience on the internet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${nunito.variable} ${pacifico.variable}`}>
        {children}
      </body>
    </html>
  );
}
