"use client";

import { Truck, Shield, RefreshCw, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
    color: "bg-nike-blue-500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
    color: "bg-nike-orange-500",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
    color: "bg-green-500",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options",
    color: "bg-purple-500",
  },
];
const Features = () => {
  return (
    <section className="section-padding bg-nike-gray-50">
      <div className="container-nike">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-lg transition-all duration-300`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-nike-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-nike-caption">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
