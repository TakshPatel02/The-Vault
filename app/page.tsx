import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full bg-bg-primary font-mono selection:bg-text-primary selection:text-bg-primary overflow-hidden flex justify-center">
      
      {/* Central Structural Container (Matches portfolio max-width grid) */}
      <div className="w-full max-w-350 h-full border-x border-border flex flex-col">
        
        {/* Row 1: Header / Label */}
        <header className="h-24 sm:h-32 border-b border-border flex items-end px-6 sm:px-12 md:px-16 pb-6 sm:pb-8 shrink-0">
          <p className="text-text-muted text-xs sm:text-sm tracking-[0.25em] uppercase">
            FIG. 00 &middot; PERSONAL ARCHIVE
          </p>
        </header>

        {/* Row 2: Massive Hero Typography */}
        <div className="flex-1 border-b border-border flex flex-col justify-center px-6 sm:px-12 md:px-16 relative overflow-hidden">
          <h1 className="text-[12vw] lg:text-[11rem] leading-[0.85] text-text-primary font-display font-medium tracking-tighter uppercase">
            THE VAULT
          </h1>
        </div>

        {/* Row 3: Context & CTA Grid */}
        <div className="h-auto md:h-64 flex flex-col md:flex-row shrink-0 border-b border-border">
          
          {/* Left Block: The Context Lines */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-border p-6 sm:p-12 md:p-16 flex flex-col justify-center bg-bg-primary">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-text-secondary text-sm leading-relaxed max-w-5xl">
              <p>
                Images that almost became<br />
                the portfolio hero.
              </p>
              <p>
                None of them made the final cut.<br />
                All of them were good enough to keep.
              </p>
              <p>
                Still growing &mdash;<br />
                new frames added whenever one earns a place here.
              </p>
            </div>
          </div>

          {/* Right Block: Massive CTA Button */}
          <Link 
            href="/browse" 
            className="w-full md:w-100 h-48 md:h-full p-6 sm:p-12 md:p-16 flex flex-col justify-end bg-bg-secondary/30 transition-all duration-300 group relative ring-1 ring-inset ring-transparent hover:ring-border-strong"
          >
            <div>
              <p className="text-text-muted text-xs uppercase tracking-[0.15em] mb-3">
                30 frames &middot; just to look
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <p className="text-xl sm:text-2xl text-text-primary font-medium tracking-tight uppercase group-hover:text-white transition-colors duration-300">
                  ENTER THE VAULT
                </p>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-text-primary group-hover:text-white transition-all duration-300 group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
          
        </div>

        {/* Row 4: One-Time Footer */}
        <footer className="h-16 sm:h-20 flex flex-col sm:flex-row items-start sm:items-center justify-center sm:justify-between px-6 sm:px-12 md:px-16 text-xs sm:text-sm text-text-muted bg-bg-primary shrink-0">
          <p className="tracking-wide">Rejected by the hero section. Approved by me.</p>
          <p className="tracking-wide mt-1 sm:mt-0">
            Taksh Patel &middot;{" "}
            <a 
              href="https://takshpatel.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-primary hover:text-white transition-colors inline-flex items-center gap-1 group underline decoration-border-strong underline-offset-4 hover:decoration-text-muted"
            >
              Portfolio 
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
          </p>
        </footer>

      </div>
    </div>
  );
}
