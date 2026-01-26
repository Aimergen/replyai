"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            // variants={itemVariants}
            className="mb-6 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" />
            14 хоногийн үнэгүй турших хугацаа
          </motion.div>
          <motion.h1
            // variants={itemVariants}
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Facebook comment-д автоматаар хариулж,{" "}
            <span className="text-primary">lead алдахаа зогсоо</span>
          </motion.h1>
          <motion.p
            // variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            &ldquo;Үнэ хэд вэ?&rdquo;, &ldquo;Байгаа юу?&rdquo;, &ldquo;Хүргэлт
            хэд вэ?&rdquo; гэсэн comment бүрт шууд хариулж, захиалга авах
            боломжоо бүү алд. Монгол хэлний keyword-based автомат хариулагч.
          </motion.p>
          <motion.div
            // variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Button size="lg" className="w-full sm:w-auto">
                Facebook-ээр нэвтрэх
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-transparent sm:w-auto"
              >
                Үнэгүй турших
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-12 sm:grid-cols-4"
          variants={statsVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { value: "500+", label: "идэвхтэй хэрэглэгч" },
            { value: "50,000+", label: "автомат хариулт/сар" },
            { value: "3x", label: "илүү олон захиалга" },
            { value: "24/7", label: "тасралтгүй ажиллана" },
          ].map(stat => (
            <motion.div
              key={stat.label}
              // variants={statItemVariants}
              className="text-center"
            >
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
