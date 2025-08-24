import HalftoneCanvas from "@/components/HalftoneCanvas";
import PromoBanner from "@/components/PromoBanner";

export default function Home() {
  return (
    <>
      <PromoBanner 
        message="Introducing Era: your new favorite crypto protocol. Coming soon to Ethereum."
        href="https://beta.akinn.xyz/" // Point to the beta ERA Protocol
      />
      <HalftoneCanvas />
    </>
  );
}