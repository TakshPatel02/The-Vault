import { HaloCardCarousel } from "@/components/HaloCardCarousel";

const vaultImages = Array.from({ length: 9 }, (_, index) => ({
  src: `/images/image-${index + 1}.jpg`,
  alt: `The Vault archive frame ${String(index + 1).padStart(2, "0")}`,
}));

export default function Home() {
  return (
    <main className="relative h-svh w-full overflow-hidden bg-bg-primary text-text-primary">
      <header className="absolute left-6 top-6 z-200000 sm:left-10 sm:top-8 md:left-12 md:top-10">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-primary sm:text-sm">
          the-vault
        </p>
      </header>

      <HaloCardCarousel images={vaultImages} />
    </main>
  );
}
