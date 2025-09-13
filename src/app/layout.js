import "./globals.css";
import { Orbitron, Space_Grotesk, Noto_Sans } from "next/font/google";
import Script from "next/script";

export const metadata = {
  title: "CosmicTwin",
  description: "Find Your Cosmic Twin",
};

// ✅ Load Google Fonts via next/font
const orbitron = Orbitron({ subsets: ["latin"], weights: ["400", "700", "900"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weights: ["400", "500", "700"] });
const notoSans = Noto_Sans({ subsets: ["latin"], weights: ["400", "500", "700", "900"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.className} bg-[var(--background-color)] text-white`}
      >
        {children}

        {/* Load Tailwind runtime (not needed if already configured in postcss.config.js) */}
        <Script
          src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
          strategy="beforeInteractive"
        />

        {/* Load model-viewer properly */}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          type="module"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
