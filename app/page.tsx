import { CategoriesProduct } from "@/components/CategoriesProduct";
import Features from "@/components/Features";
import FeaturesProducts from "@/components/FeaturesProducts";
import Hero from "@/components/Hero";
export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <CategoriesProduct />
      <FeaturesProducts />
    </div>
  );
}
