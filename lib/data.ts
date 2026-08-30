export interface VaultImage {
  id: string;       // stable, never changes even if list is reordered/trimmed
  src: string;
  alt: string;
  addedAt: string;  // for "still growing" sort order, honesty about recency
}

export const vaultImages: VaultImage[] = [
  { id: "001", src: "/images/image-1.jpg", alt: "Vault archive frame 001", addedAt: "2026-08-30" },
  { id: "002", src: "/images/image-2.jpg", alt: "Vault archive frame 002", addedAt: "2026-08-30" },
  { id: "003", src: "/images/image-3.jpg", alt: "Vault archive frame 003", addedAt: "2026-08-30" },
  { id: "004", src: "/images/image-4.jpg", alt: "Vault archive frame 004", addedAt: "2026-08-30" },
  { id: "005", src: "/images/image-5.jpg", alt: "Vault archive frame 005", addedAt: "2026-08-30" },
  { id: "006", src: "/images/image-6.jpg", alt: "Vault archive frame 006", addedAt: "2026-08-30" },
  { id: "007", src: "/images/image-7.jpg", alt: "Vault archive frame 007", addedAt: "2026-08-30" },
  { id: "008", src: "/images/image-8.jpg", alt: "Vault archive frame 008", addedAt: "2026-08-30" },
  { id: "009", src: "/images/image-9.jpg", alt: "Vault archive frame 009", addedAt: "2026-08-30" },
  { id: "010", src: "/images/image-10.jpg", alt: "Vault archive frame 010", addedAt: "2026-08-30" },
  { id: "011", src: "/images/image-11.jpg", alt: "Vault archive frame 011", addedAt: "2026-08-30" },
  { id: "012", src: "/images/image-12.jpg", alt: "Vault archive frame 012", addedAt: "2026-08-30" },
  { id: "013", src: "/images/image-13.jpg", alt: "Vault archive frame 013", addedAt: "2026-08-30" },
  { id: "014", src: "/images/image-14.jpg", alt: "Vault archive frame 014", addedAt: "2026-08-30" },
  { id: "015", src: "/images/image-15.jpg", alt: "Vault archive frame 015", addedAt: "2026-08-30" },
  { id: "016", src: "/images/image-16.jpg", alt: "Vault archive frame 016", addedAt: "2026-08-30" },
  { id: "017", src: "/images/image-17.jpg", alt: "Vault archive frame 017", addedAt: "2026-08-30" },
  { id: "018", src: "/images/image-18.jpg", alt: "Vault archive frame 018", addedAt: "2026-08-30" },
  { id: "019", src: "/images/image-19.jpg", alt: "Vault archive frame 019", addedAt: "2026-08-30" },
  { id: "020", src: "/images/image-20.jpg", alt: "Vault archive frame 020", addedAt: "2026-08-30" },
  { id: "021", src: "/images/image-21.jpg", alt: "Vault archive frame 021", addedAt: "2026-08-30" },
  { id: "022", src: "/images/image-22.jpg", alt: "Vault archive frame 022", addedAt: "2026-08-30" },
  { id: "023", src: "/images/image-23.jpg", alt: "Vault archive frame 023", addedAt: "2026-08-30" },
  { id: "024", src: "/images/image-24.jpg", alt: "Vault archive frame 024", addedAt: "2026-08-30" },
  { id: "025", src: "/images/image-25.jpg", alt: "Vault archive frame 025", addedAt: "2026-08-30" },
  { id: "026", src: "/images/image-26.jpg", alt: "Vault archive frame 026", addedAt: "2026-08-30" },
  { id: "027", src: "/images/image-27.jpg", alt: "Vault archive frame 027", addedAt: "2026-08-30" },
  { id: "028", src: "/images/image-28.jpg", alt: "Vault archive frame 028", addedAt: "2026-08-30" },
  { id: "029", src: "/images/image-29.jpg", alt: "Vault archive frame 029", addedAt: "2026-08-30" },
  { id: "030", src: "/images/image-30.jpg", alt: "Vault archive frame 030", addedAt: "2026-08-30" },
];
