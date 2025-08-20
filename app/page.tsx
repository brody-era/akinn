import HalftoneCanvas from "@/components/HalftoneCanvas";
import PromoBanner from "@/components/PromoBanner";

export default function Home() {
  return (
    <>
      <PromoBanner 
        message="Introducing Era: your new favorite crypto protocol. Coming soon to Ethereum."
        href="https://apps.apple.com/your-app-link" // Replace with your actual App Store link
      />
      <HalftoneCanvas />
    </>
  );
}