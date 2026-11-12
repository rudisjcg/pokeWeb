import Featured from "@/components/Featured";
import Header from "@/components/Header";

export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      <Header />
      <Featured />
    </>
  );
}
