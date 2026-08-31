import Link from "next/link";
import { VaultImage } from "@/components/VaultImage";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { vaultImages } from "@/lib/data";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pageParam = typeof params.page === 'string' ? params.page : '1';
  let currentPage = parseInt(pageParam, 10);
  
  const totalFrames = vaultImages.length;
  const framesPerPage = 6;
  const totalPages = Math.ceil(totalFrames / framesPerPage);

  // Keep page within bounds
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * framesPerPage;
  const endIndex = Math.min(startIndex + framesPerPage, totalFrames);
  const pageImages = vaultImages.slice(startIndex, endIndex);

  // Formatting helpers
  const formatNum = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="min-h-screen md:h-screen w-full bg-bg-primary font-mono selection:bg-text-primary selection:text-bg-primary flex justify-center md:overflow-hidden">
      
      {/* Central Structural Container */}
      <div className="w-full max-w-350 min-h-screen md:h-full border-x border-border flex flex-col md:overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-14 sm:h-16 border-b border-border flex items-center justify-between px-6 sm:px-12 md:px-16 shrink-0 text-xs sm:text-sm text-text-muted uppercase tracking-[0.15em]">
          <p>FIG. {formatNum(startIndex + 1)}&ndash;{formatNum(endIndex)} &middot; PAGE {formatNum(currentPage)}</p>
          <p>{totalFrames} FRAMES TOTAL</p>
        </header>

        {/* Main Grid — 3 columns x 2 rows */}
        <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2">
          {pageImages.map((image, i) => (
            <div 
              key={image.id} 
              className={`border-border p-4 sm:p-6 md:p-8 flex flex-col relative group min-h-87.5 sm:min-h-112.5 md:min-h-0 md:overflow-hidden
                ${i === pageImages.length - 1 ? "border-b-0" : "border-b"}
                ${i >= 3 ? "md:border-b-0" : "md:border-b"}
                md:border-r 
                ${(i + 1) % 3 === 0 ? "md:border-r-0" : ""}`}
            >
              <div className="flex-1 min-h-0 relative w-full mb-3">
                <VaultImage 
                  src={image.src} 
                  alt={image.alt} 
                  priority
                />
              </div>
              
              <div className="text-xs text-text-muted uppercase tracking-[0.2em] flex justify-between items-center group-hover:text-text-primary transition-colors duration-300 shrink-0">
                <p>Fig: {image.id}</p>
                <p>{image.addedAt}</p>
              </div>
            </div>
          ))}
        </main>

        {/* Bottom Bar */}
        <footer className="h-16 sm:h-20 border-t border-border flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 md:px-16 shrink-0 text-xs sm:text-sm text-text-muted uppercase tracking-[0.15em] bg-bg-primary gap-2 sm:gap-0">
          
          <div className="flex-1 flex justify-start">
            <Link href="/" className="hover:text-text-primary transition-colors flex items-center gap-2 group">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" /> BACK TO HOME
            </Link>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            {currentPage > 1 ? (
              <Link href={`/browse?page=${currentPage - 1}`} className="hover:text-text-primary transition-colors flex items-center gap-2 group">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" /> PREV
              </Link>
            ) : (
              <span className="opacity-40 cursor-not-allowed flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> PREV
              </span>
            )}
            
            <span className="text-text-primary font-medium">PAGE {formatNum(currentPage)} / {formatNum(totalPages)}</span>
            
            {currentPage < totalPages ? (
              <Link href={`/browse?page=${currentPage + 1}`} className="hover:text-text-primary transition-colors flex items-center gap-2 group">
                NEXT <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <span className="opacity-40 cursor-not-allowed flex items-center gap-2">
                NEXT <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 justify-end hidden sm:flex">
            <span>{totalFrames} FRAMES</span>
          </div>

        </footer>

      </div>
    </div>
  );
}