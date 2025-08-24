import HalftoneCanvas from "@/components/HalftoneCanvas";
import PromoBanner from "@/components/PromoBanner";

export default function Home() {
  return (
    <>
      <PromoBanner 
        message="Introducing Era: your new favorite crypto protocol. Coming soon to Ethereum."
        href="https://akinn.xyz/not-found" // Replace with redirect link
      />
      <HalftoneCanvas />
    </>
  );
}