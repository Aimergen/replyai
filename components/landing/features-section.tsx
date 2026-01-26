"use client";

import {
  MessageCircle,
  Clock,
  Globe,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "Монгол хэлний keyword",
    description:
      'Монгол хэлний үг, товчлол, хувилбаруудыг таньж чаддаг. "үнэ", "vne", "yne" бүгдийг ойлгоно.',
    icon: Globe,
  },
  {
    name: "Хормын дотор хариулна",
    description:
      "Comment ирмэгц секундын дотор хариулна. Хэрэглэгч хүлээхгүй, өрсөлдөгч рүү очихгүй.",
    icon: Clock,
  },
  {
    name: "Олон Page дэмжинэ",
    description: "Хэд ч Page холбож болно. Бүх shop-уудаа нэг дороос удирдана.",
    icon: MessageCircle,
  },
  {
    name: "Статистик харах",
    description:
      "Хэдэн comment ирсэн, хэдэнд хариулсан, аль keyword түгээмэл байгааг харна.",
    icon: BarChart3,
  },
  {
    name: "Найдвартай, аюулгүй",
    description:
      "Facebook-ийн албан ёсны API ашигладаг. Таны Page-д ямар ч эрсдэлгүй.",
    icon: Shield,
  },
  {
    name: "Утаснаас удирдах",
    description: "Хаанаас ч утаснаасаа keyword нэмэх, засах боломжтой.",
    icon: Smartphone,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Боломжууд
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Яагаад autoreply.mn гэж?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Монголын онлайн shop эздэд зориулж бүтээсэн. Энгийн, хурдан,
            найдвартай.
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map(feature => (
            <motion.div
              key={feature.name}
              // variants={cardVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
                borderColor: "var(--primary)",
              }}
              transition={{ duration: 0.25 }}
              className="relative rounded-2xl border border-border bg-background p-6"
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
