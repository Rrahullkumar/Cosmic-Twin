import './globals.css';

export const metadata = {
  title: 'CosmicTwin',
  description: 'Find Your Cosmic Twin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link crossOrigin="" href="https://fonts.gstatic.com/" rel="preconnect" />
        <link as="style"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans%3Awght%40400%3B500%3B700%3B900&family=Space+Grotesk%3Awght%40400%3B500%3B700&family=Orbitron:wght@400;700;900&display=swap"
          onLoad="this.rel='stylesheet'" rel="stylesheet" />
        <link href="data:image/x-icon;base64," rel="icon" type="image/x-icon" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" type="module"></script>
      </head>
      <body className="bg-[var(--background-color)] text-white" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
        {children}
      </body>
    </html>
  );
}
