import { AboutSection } from "@/components/AboutSection";
import { BookSection } from "@/components/BookSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { IdentitySection } from "@/components/IdentitySection";
import { Newsletter } from "@/components/Newsletter";
import { OfferSection } from "@/components/OfferSection";
import { StickyCta } from "@/components/StickyCta";
import { Testimonials } from "@/components/Testimonials";
import { getBookProduct } from "@/lib/shopify/client";

export default async function Home() {
  const product = await getBookProduct();

  return (
    <div id="top" className="flex min-h-full flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <Header />
      <main className="flex-1">
        <Hero />
        <BookSection product={product} />
        <OfferSection product={product} />
        <Testimonials />
        <AboutSection />
        <IdentitySection />
        <Newsletter />
      </main>
      <Footer />
      <StickyCta
        price={product.priceRange.minVariantPrice.amount}
        currencyCode={product.priceRange.minVariantPrice.currencyCode}
      />
    </div>
  );
}
