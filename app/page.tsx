import { Hero } from "@/components/Hero";
import { WorkList } from "@/components/WorkList";
import { TechStack } from "@/components/TechStack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="flex flex-1 flex-col divide-y divide-border">
        <WorkList />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
