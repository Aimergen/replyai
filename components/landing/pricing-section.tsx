"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "15,000₮",
    period: "/сар",
    description: "1 Page-тэй жижиг shop-д тохиромжтой",
    features: [
      "1 Facebook Page",
      "10 keyword хүртэл",
      "Сард 500 автомат хариулт",
      "Энгийн статистик",
      "Email дэмжлэг",
    ],
    highlighted: false,
    cta: "Эхлэх",
  },
  {
    name: "Pro",
    price: "29,000₮",
    period: "/сар",
    description: "Идэвхтэй борлуулалттай shop-д",
    features: [
      "3 Facebook Page хүртэл",
      "Хязгааргүй keyword",
      "Сард 5,000 автомат хариулт",
      "Дэлгэрэнгүй статистик",
      "Тэргүүлэх дэмжлэг",
      "Keyword санал болгох",
    ],
    highlighted: true,
    cta: "Эхлэх",
  },
  {
    name: "Business",
    price: "49,000₮",
    period: "/сар",
    description: "Олон Page-тэй том бизнест",
    features: [
      "10 Facebook Page хүртэл",
      "Хязгааргүй keyword",
      "Хязгааргүй автомат хариулт",
      "Дэлгэрэнгүй статистик",
      "24/7 дэмжлэг",
      "Тусгай тохиргоо",
      "API хандалт",
    ],
    highlighted: false,
    cta: "Холбоо барих",
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function PricingSection() {
  return (
    <section id="pricing" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Үнийн хүснэгт
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Энгийн, ил тод үнэ
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            14 хоногийн үнэгүй турших хугацаатай. Картын мэдээлэл шаардахгүй.
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {plans.map(plan => (
            <motion.div
              key={plan.name}
              // variants={cardVariants}
              whileHover={{
                y: plan.highlighted ? -8 : -6,
                boxShadow: plan.highlighted
                  ? "0 25px 50px -12px rgba(0,0,0,0.25)"
                  : "0 20px 40px -15px rgba(0,0,0,0.1)",
              }}
              transition={{ duration: 0.25 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8",
                plan.highlighted
                  ? "border-primary bg-primary text-primary-foreground shadow-xl scale-105"
                  : "border-border bg-background",
              )}
            >
              {plan.highlighted && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <span className="inline-block rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                    Хамгийн түгээмэл
                  </span>
                </motion.div>
              )}
              <div>
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    plan.highlighted
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      plan.highlighted
                        ? "text-primary-foreground"
                        : "text-foreground",
                    )}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      plan.highlighted
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-2 text-sm",
                    plan.highlighted
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {plan.description}
                </p>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "h-5 w-5 shrink-0",
                        plan.highlighted
                          ? "text-primary-foreground"
                          : "text-primary",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        plan.highlighted
                          ? "text-primary-foreground/90"
                          : "text-muted-foreground",
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="mt-8"
              >
                <Button
                  className={cn(
                    "w-full",
                    plan.highlighted
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "",
                  )}
                  variant={plan.highlighted ? "secondary" : "outline"}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
