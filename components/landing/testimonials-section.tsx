"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Өмнө нь өдөрт 100 гаруй comment-д гараар хариулдаг байсан. Одоо бүгд автомат. Захиалга 2 дахин нэмэгдсэн!",
    author: "Б. Оюунчимэг",
    role: "Хүүхдийн хувцас",
    company: "@oyuka_kids_fashion",
    initials: "БО",
  },
  {
    quote:
      "Шөнийн comment-д хариулж чадахгүй байсан. Одоо өглөө бослоо гэхэд Messenger дүүрэн захиалга байдаг болсон.",
    author: "Д. Батбаяр",
    role: "Электроник бараа",
    company: "@tech_mongolia",
    initials: "ДБ",
  },
  {
    quote:
      "Админ хөлслөхөөс хямд, илүү найдвартай. Хариу буруу өгөхгүй, цаг алдахгүй. 100% санал болгоно!",
    author: "Э. Сарангэрэл",
    role: "Гоо сайхны бүтээгдэхүүн",
    company: "@saral_beauty",
    initials: "ЭС",
  },
  {
    quote:
      "Setup хийхэд 10 минут л орсон. Техникийн мэдлэггүй ч хийж чадсан. Маш энгийн!",
    author: "М. Ганзориг",
    role: "Хүнсний бараа",
    company: "@fresh_foods_mn",
    initials: "МГ",
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

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Хэрэглэгчдийн сэтгэгдэл
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Shop эзэд юу гэж хэлдэг вэ?
          </h2>
        </motion.div>
        <motion.div
          className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map(testimonial => (
            <motion.div
              key={testimonial.author}
              // variants={cardVariants}
              whileHover={{
                y: -4,
                boxShadow: "0 15px 40px -15px rgba(0,0,0,0.1)",
              }}
              transition={{ duration: 0.25 }}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6"
            >
              <blockquote className="text-pretty leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-primary">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
