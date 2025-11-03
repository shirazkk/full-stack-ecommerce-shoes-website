import { CategoriesProduct } from "@/components/CategoriesProduct";
import Features from "@/components/Features";
import FeaturesProducts from "@/components/FeaturesProducts";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <NewArrivals/>
      <CategoriesProduct />
      <FeaturesProducts />
    </div>
  );
}
