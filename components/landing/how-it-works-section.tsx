"use client";

import { Facebook, Settings, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: Facebook,
    title: "Facebook Page-аа холбоно",
    description:
      "Facebook-ээр нэвтэрч, Page-аа сонгоход л бэлэн. 30 секунд л болно.",
  },
  {
    step: "02",
    icon: Settings,
    title: "Keyword тохируулна",
    description:
      '"үнэ", "байгаа юу", "хүргэлт" гэх мэт түлхүүр үгс, тэдгээрт өгөх хариуг тохируулна.',
  },
  {
    step: "03",
    icon: Zap,
    title: "Автоматаар ажиллана",
    description:
      "Comment ирэхэд тохируулсан хариуг шууд илгээнэ. Та унтаж байхад ч ажиллана.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Захиалга нэмэгдэнэ",
    description: "Хурдан хариу = илүү олон захиалга. Lead алдахаа болино.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Хэрхэн ажилладаг вэ?
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            4 энгийн алхамаар эхлэх
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Техникийн мэдлэг шаардлагагүй. Хэн ч хийж чадна.
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}
              <motion.div
                className="relative mx-auto flex h-24 w-24 items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 rounded-full bg-primary/10" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
              </motion.div>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-primary">
                Алхам {step.step}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
