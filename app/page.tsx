import HalftoneCanvas from "@/components/HalftoneCanvas";
import PromoBanner from "@/components/PromoBanner";

export default function Home() {
  return (
    <>
      <PromoBanner 
        message="Introducing Akinn: your new favorite web3 Studio"
        href="https://akinn.xyz/not-found" // Replace with redirect link
      />
      <HalftoneCanvas />
    </>
  );
}