import { Header } from "@/components/Header";
import { WorkList } from "@/components/WorkList";
import { TechStack } from "@/components/TechStack";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col divide-y divide-border">
        <WorkList />
        <TechStack />
      </main>
      <Footer />
    </>
  );
}
