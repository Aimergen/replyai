"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Facebook Page-аа хэрхэн холбох вэ?",
    answer: "Facebook-ээр нэвтэрч, Page-аа сонгоход л болно. Ямар ч нэмэлт тохиргоо шаардлагагүй. 30 секундын дотор бэлэн болно.",
  },
  {
    question: "Миний Page-д эрсдэлтэй юу?",
    answer: "Үгүй. Бид Facebook-ийн албан ёсны API ашигладаг. Таны Page-ийн аюулгүй байдалд нөлөөлөхгүй. Мөн ямар ч spam илгээхгүй, зөвхөн таны тохируулсан хариуг л өгнө.",
  },
  {
    question: "Монгол хэлний түлхүүр үгсийг ойлгох уу?",
    answer: "Тийм. Монгол хэлний үг, товчлол, латин үсгээр бичсэн хувилбаруудыг бүгдийг ойлгоно. Жишээ нь: \"үнэ\", \"vne\", \"yne\", \"vn\" гэх мэт.",
  },
  {
    question: "Хэдэн keyword тохируулж болох вэ?",
    answer: "Багц бүрт харилцан адилгүй. Starter багцад 10 хүртэл, Pro болон Business багцад хязгааргүй keyword тохируулж болно.",
  },
  {
    question: "Үнэгүй турших хугацаа байгаа юу?",
    answer: "Тийм. Бүх багцад 14 хоногийн үнэгүй турших хугацаа байна. Картын мэдээлэл шаардахгүй. Таалагдаагүй бол цуцлахад хялбар.",
  },
  {
    question: "Төлбөрийг хэрхэн хийх вэ?",
    answer: "QPay, Social Pay, банкны шилжүүлгээр төлбөр хийж болно. Сар бүр автоматаар шинэчлэгдэнэ.",
  },
  {
    question: "Тусламж хэрэгтэй бол хаана хандах вэ?",
    answer: "Манай дэмжлэгийн баг Facebook Messenger, email-ээр 24 цагийн дотор хариу өгнө. Pro болон Business хэрэглэгчдэд тэргүүлэх дэмжлэг үзүүлнэ.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Түгээмэл асуултууд</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Асуулт байна уу?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Хамгийн түгээмэл асуултуудын хариултыг эндээс олоорой.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
