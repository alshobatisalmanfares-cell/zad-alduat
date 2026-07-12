import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Mail, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "تواصل معنا | زاد الدعاة" },
      { name: "description", content: "تواصل مع فريق زاد الدعاة عبر البريد الإلكتروني أو واتساب لأي استفسار أو اقتراح." },
    ],
  }),
});

const EMAIL = "salman77fares@gmail.com";
const WHATSAPP_INTL = "+967713867791";
const WHATSAPP_LINK = "https://wa.me/967713867791";

function ContactPage() {
  return (
    <div>
      <PageHeader title="تواصل معنا" subtitle="نسعد بتواصلكم ومقترحاتكم" />

      <div className="px-5 mt-6 space-y-4">
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent("تطبيق زاد الدعاة")}`}
          className="group block rounded-3xl p-5 border border-[color:var(--gold)]/40 shadow-soft bg-gradient-to-br from-[oklch(0.18_0.02_80)] via-[oklch(0.14_0.02_80)] to-[oklch(0.10_0.02_80)] hover:border-[color:var(--gold)] transition"
        >
          <div className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br from-[color:var(--gold)] to-[oklch(0.62_0.13_75)] text-black shadow-lg shrink-0">
              <Mail className="h-7 w-7" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--gold)]/80 mb-1">
                البريد الإلكتروني
              </div>
              <div className="font-black text-base text-[color:var(--gold)] truncate">{EMAIL}</div>
              <div className="text-xs text-[color:var(--gold)]/70 mt-1">اضغط للمراسلة عبر البريد</div>
            </div>
          </div>
        </a>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-3xl p-5 border border-[color:var(--gold)]/40 shadow-soft bg-gradient-to-br from-[oklch(0.18_0.02_80)] via-[oklch(0.14_0.02_80)] to-[oklch(0.10_0.02_80)] hover:border-[color:var(--gold)] transition"
        >
          <div className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br from-[color:var(--gold)] to-[oklch(0.62_0.13_75)] text-black shadow-lg shrink-0">
              <MessageCircle className="h-7 w-7" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--gold)]/80 mb-1">
                واتساب
              </div>
              <div className="font-black text-base text-[color:var(--gold)] flex items-center gap-1.5" dir="ltr">
                <Phone className="h-4 w-4" /> {WHATSAPP_INTL}
              </div>
              <div className="text-xs text-[color:var(--gold)]/70 mt-1">اضغط لفتح محادثة مباشرة</div>
            </div>
          </div>
        </a>

        <p className="text-center text-xs text-muted-foreground pt-4">
          نرحّب باقتراحاتكم لتطوير التطبيق. بارك الله فيكم.
        </p>
      </div>

      <div className="h-10" />
    </div>
  );
}
