import { VaultHero } from "@/components/VaultHero";
import { VaultStatement } from "@/components/VaultStatement";
import { VaultFooter } from "@/components/VaultFooter";

export default function Home() {
  return (
    <main>
      <VaultHero />
      <VaultStatement />
      <VaultFooter />
    </main>
  );
}
