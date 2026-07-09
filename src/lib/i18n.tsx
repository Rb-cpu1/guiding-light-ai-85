import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

type Dict = Record<string, string>;

const pt: Dict = {
  "app.name": "MENTOR",
  "app.tagline": "O mentor que te faz vencer todo dia",
  "cta.start": "Começar",
  "cta.continue": "Continuar",
  "cta.finish": "Concluir",
  "cta.signin": "Entrar",
  "cta.signup": "Criar conta",
  "cta.signout": "Sair",
  "cta.google": "Continuar com Google",
  "cta.talkmentor": "Falar com meu Mentor",
  "cta.send": "Enviar",
  "auth.email": "E-mail",
  "auth.password": "Senha",
  "auth.name": "Seu nome",
  "auth.have": "Já tem conta?",
  "auth.no": "Novo por aqui?",
  "onb.q1": "Qual sua maior luta agora?",
  "onb.q2": "Como você quer ser guiado?",
  "onb.q3": "Qual sua visão de mundo?",
  "onb.struggle.finances": "Finanças",
  "onb.struggle.relationship": "Relacionamento",
  "onb.struggle.faith": "Fé",
  "onb.struggle.discipline": "Disciplina",
  "onb.struggle.purpose": "Propósito",
  "onb.struggle.anxiety": "Ansiedade",
  "onb.mode.pastor": "Pastor — acolhedor, cheio de graça",
  "onb.mode.sargento": "Sargento — direto, sem rodeios",
  "onb.mode.sabio": "Sábio — reflexivo, faz perguntas",
  "onb.mode.coach": "Coach — energético, motivador",
  "onb.faith.firm": "Cristão / religioso",
  "onb.faith.seeking": "Espiritual, não religioso",
  "onb.faith.questioning": "Agnóstico / em dúvida",
  "onb.faith.curious": "Ateu / prático",
  "home.greet.morning": "Bom dia",
  "home.greet.afternoon": "Boa tarde",
  "home.greet.evening": "Boa noite",
  "home.word": "Sabedoria de Hoje",
  "home.mission": "Missão do dia",
  "home.mission.body": "Ore 5 minutos em silêncio. Nomeie uma coisa que você é grato por hoje.",
  "chat.placeholder": "Compartilhe o que está no seu coração...",
  "chat.empty": "Diga o que te trava. Vou ser direto e te tirar do lugar.",
  "chat.limit": "Você atingiu o limite gratuito de hoje.",
  "chat.limit.cta": "Ver planos",
  "chat.error": "Algo deu errado. Tente novamente.",
  "profile.title": "Perfil",
  "profile.mode": "Modo do Mentor",
  "profile.language": "Idioma",
  "profile.stats": "Conversas",
  "paywall.title": "Sabedoria ilimitada",
  "paywall.sub": "Desbloqueie conversas sem limite, todos os modos e áudios personalizados.",
  "paywall.monthly": "Mensal",
  "paywall.yearly": "Anual",
  "paywall.plus": "Premium+",
  "paywall.trial": "7 dias grátis",
  "paywall.notice": "Assinatura será liberada em breve.",
  "nav.home": "Início",
  "nav.chat": "Mentor",
  "nav.profile": "Perfil",
  "landing.headline": "O mentor que te faz vencer todo dia.",
  "landing.sub": "Toda a biblioteca de riqueza, negócios, vendas, disciplina e filosofia — junto com a Bíblia — numa resposta direta pro seu problema real.",
  "landing.cta": "Começar agora",
};

const en: Dict = {
  "app.name": "MENTOR",
  "app.tagline": "The mentor that makes you win daily",
  "cta.start": "Start",
  "cta.continue": "Continue",
  "cta.finish": "Finish",
  "cta.signin": "Sign in",
  "cta.signup": "Create account",
  "cta.signout": "Sign out",
  "cta.google": "Continue with Google",
  "cta.talkmentor": "Talk to my Mentor",
  "cta.send": "Send",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.name": "Your name",
  "auth.have": "Already have an account?",
  "auth.no": "New here?",
  "onb.q1": "What's your biggest struggle right now?",
  "onb.q2": "How do you want to be guided?",
  "onb.q3": "What's your worldview?",
  "onb.struggle.finances": "Finances",
  "onb.struggle.relationship": "Relationships",
  "onb.struggle.faith": "Faith",
  "onb.struggle.discipline": "Discipline",
  "onb.struggle.purpose": "Purpose",
  "onb.struggle.anxiety": "Anxiety",
  "onb.mode.pastor": "Pastor — warm, full of grace",
  "onb.mode.sargento": "Sergeant — direct, no fluff",
  "onb.mode.sabio": "Sage — reflective, asks questions",
  "onb.mode.coach": "Coach — energetic, motivating",
  "onb.faith.firm": "Christian / religious",
  "onb.faith.seeking": "Spiritual, not religious",
  "onb.faith.questioning": "Agnostic / unsure",
  "onb.faith.curious": "Atheist / practical",
  "home.greet.morning": "Good morning",
  "home.greet.afternoon": "Good afternoon",
  "home.greet.evening": "Good evening",
  "home.word": "Today's Wisdom",
  "home.mission": "Today's mission",
  "home.mission.body": "Pray 5 minutes in silence. Name one thing you're grateful for today.",
  "chat.placeholder": "Share what's on your heart...",
  "chat.empty": "Tell me what's blocking you. I'll be direct and move you forward.",
  "chat.limit": "You've reached today's free limit.",
  "chat.limit.cta": "See plans",
  "chat.error": "Something went wrong. Try again.",
  "profile.title": "Profile",
  "profile.mode": "Mentor mode",
  "profile.language": "Language",
  "profile.stats": "Conversations",
  "paywall.title": "Unlimited wisdom",
  "paywall.sub": "Unlock unlimited chats, every mode, and personalized audio.",
  "paywall.monthly": "Monthly",
  "paywall.yearly": "Yearly",
  "paywall.plus": "Premium+",
  "paywall.trial": "7-day free trial",
  "paywall.notice": "Subscriptions launching soon.",
  "nav.home": "Home",
  "nav.chat": "Mentor",
  "nav.profile": "Profile",
  "landing.headline": "The mentor that makes you win every day.",
  "landing.sub": "The entire library of wealth, business, sales, discipline and philosophy — together with the Bible — in one direct answer to your real problem.",
  "landing.cta": "Start now",
};

const dicts: Record<Lang, Dict> = { pt, en };

type I18nCtx = { lang: Lang; t: (k: string) => string; setLang: (l: Lang) => void };
const Ctx = createContext<I18nCtx>({ lang: "pt", t: (k) => k, setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");
  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("mentor.lang") as Lang | null) : null;
    if (stored === "pt" || stored === "en") setLangState(stored);
    else if (typeof navigator !== "undefined" && navigator.language.startsWith("en")) setLangState("en");
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("mentor.lang", l);
  };
  const t = (k: string) => dicts[lang][k] ?? k;
  return <Ctx.Provider value={{ lang, t, setLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);