"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Facebook } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="bg-primary py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Comment бүрт хариулж, захиалга нэмэгдүүл
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/80">
            Таны унтаж байхад ч ажиллана. Өрсөлдөгч рүү очих хэрэглэгчээ буцааж
            ав. 14 хоног үнэгүй туршаад үр дүнг нь хар.
          </p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="w-full bg-background text-foreground hover:bg-background/90 sm:w-auto"
              >
                <Facebook className="mr-2 h-5 w-5" />
                Одоо эхлэх
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
                className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              >
                Дэлгэрэнгүй
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
          <motion.p
            className="mt-6 text-sm text-primary-foreground/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Картын мэдээлэл шаардахгүй. Хүссэн үедээ цуцлах боломжтой.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
