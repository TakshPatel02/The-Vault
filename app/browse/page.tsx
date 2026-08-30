import Link from "next/link";
import Image from "next/image";
import { vaultImages } from "@/lib/data";

export default function BrowsePage() {
  const pageImages = vaultImages.slice(0, 6);

  return (
    <div className="h-screen w-full bg-bg-primary font-mono selection:bg-text-primary selection:text-bg-primary flex justify-center overflow-hidden">
      
      {/* Central Structural Container */}
      <div className="w-full max-w-350 h-full border-x border-border flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-14 sm:h-16 border-b border-border flex items-center justify-between px-6 sm:px-12 md:px-16 shrink-0 text-xs sm:text-sm text-text-muted uppercase tracking-[0.15em]">
          <p>FIG. 01&ndash;06 &middot; PAGE 01</p>
          <p>30 FRAMES TOTAL</p>
        </header>

        {/* Main Grid — 3 columns x 2 rows */}
        <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2">
          {pageImages.map((image, i) => (
            <div 
              key={image.id} 
              className={`border-b border-border p-4 sm:p-6 md:p-8 flex flex-col relative group min-h-0 overflow-hidden
                md:border-r 
                ${(i + 1) % 3 === 0 ? "md:border-r-0" : ""}
                ${i < 3 ? "md:border-b" : "md:border-b-0"}`}
            >
              <div className="flex-1 min-h-0 relative w-full mb-3">
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  fill 
                  className="object-contain" 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
              
              <div className="text-xs text-text-muted uppercase tracking-[0.2em] flex justify-between items-center group-hover:text-text-primary transition-colors duration-300 shrink-0">
                <p>Fig: {image.id}</p>
              </div>
            </div>
          ))}
        </main>

        {/* Bottom Bar */}
        <footer className="h-16 sm:h-20 border-t border-border flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 md:px-16 shrink-0 text-xs sm:text-sm text-text-muted uppercase tracking-[0.15em] bg-bg-primary gap-2 sm:gap-0">
          
          <div className="flex-1 flex justify-start">
            <Link href="/" className="hover:text-text-primary transition-colors flex items-center gap-2">
              <span>&larr;</span> BACK TO HOME
            </Link>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            <span className="opacity-40 cursor-not-allowed flex items-center gap-2">
              <span>&larr;</span> PREV
            </span>
            <span className="text-text-primary font-medium">PAGE 01 / 05</span>
            <Link href="/browse" className="hover:text-text-primary transition-colors flex items-center gap-2">
              NEXT <span>&rarr;</span>
            </Link>
          </div>

          <div className="flex-1 justify-end hidden sm:flex">
            <span>30 FRAMES</span>
          </div>

        </footer>

      </div>
    </div>
  );
}