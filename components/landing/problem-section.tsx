"use client";

import { AlertCircle, Clock, MessageSquareX, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: Clock,
    title: "Өдөржин утас барьж байна уу?",
    description:
      'Нэг л "Үнэ хэд вэ?" comment ирэхэд бүгдэд нь гараар хариулах гэж цаг үрдэг.',
  },
  {
    icon: MessageSquareX,
    title: "Хариу өгөхөөс өмнө өрсөлдөгч рүү очсон",
    description:
      "Та хариу өгөх гэтэл тэр хүн аль хэдийн өөр газраас захиалга хийчихсэн байдаг.",
  },
  {
    icon: TrendingDown,
    title: "Шөнийн захиалга алдаж байна",
    description:
      "Та унтаж байхад ирсэн comment-д хариулж чадахгүй. Өглөө бол хэтэрхий орой.",
  },
  {
    icon: AlertCircle,
    title: "Админ авах хүртэл хүлээж чадахгүй",
    description:
      "Админ хөлслөх нь үнэтэй, найдваргүй. Гэхдээ ганцаараа амжихгүй байна.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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
      ease: "easeOut",
    },
  },
};

export function ProblemSection() {
  return (
    <section id="problem" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Танил асуудал уу?
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Онлайн shop эзний өдөр тутмын толгойн өвчин
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Facebook-ээр худалдаа хийдэг бол эдгээр асуудлууд танд танил байх л
            даа...
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {problems.map(problem => (
            <motion.div
              key={problem.title}
              // variants={cardVariants}
              whileHover={{
                y: -4,
                boxShadow: "0 10px 40px -15px rgba(0,0,0,0.1)",
              }}
              transition={{ duration: 0.2 }}
              className="flex gap-4 rounded-2xl border border-border bg-background p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
