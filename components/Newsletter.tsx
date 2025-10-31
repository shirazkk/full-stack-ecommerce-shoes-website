// "use client";
// import { Button } from "@/components/ui/button";

// import { Zap, Award, Heart } from "lucide-react";
// import { motion } from "framer-motion";

// const Newsletter = () => {
//   return (
//     <section className="section-padding gradient-nike">
//       <div className="container-nike text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="max-w-4xl mx-auto space-y-8"
//         >
//           <div className="space-y-4">
//             <h2 className="text-nike-display text-5xl md:text-6xl text-white">
//               Stay in the Game
//             </h2>
//             <p className="text-nike-body text-xl text-nike-gray-200 max-w-2xl mx-auto">
//               Get exclusive access to new releases, special offers, and insider
//               updates. Join the community of champions.
//             </p>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             viewport={{ once: true }}
//             className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
//           >
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="input-nike flex-1 text-nike-black"
//             />
//             <Button size="lg" className="btn-nike-primary text-lg px-8 py-4">
//               Subscribe
//             </Button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             viewport={{ once: true }}
//             className="flex justify-center items-center gap-8 text-nike-gray-300"
//           >
//             <div className="flex items-center gap-2">
//               <Zap className="h-5 w-5 text-nike-orange-400" />
//               <span className="text-sm">Exclusive Drops</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Award className="h-5 w-5 text-nike-orange-400" />
//               <span className="text-sm">Member Benefits</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Heart className="h-5 w-5 text-nike-orange-400" />
//               <span className="text-sm">Early Access</span>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Newsletter;
