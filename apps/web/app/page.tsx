import Featured from "@/components/Featured";
import Hero from "@/components/home/Hero";

export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Featured />
    </>
  );
}
