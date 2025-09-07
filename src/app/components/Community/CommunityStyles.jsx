'use client';

export default function CommunityStyles() {
  return (
    <style jsx global>{`
      :root {
        --warm-lilac-gray: #EAE8F1;
        --soft-mint-green: #D9F2E6;
        --muted-pink: #F8C3D7;
        --lavender-purple: #D6C6E8;
        --off-white: #FCF8F9;
        --dark-text: #1B0E13;
        --subtle-text: #974E69;
      }
      
      body {
        font-family: 'Quicksand', 'Nunito', sans-serif;
        overflow-x: hidden;
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  );
}
