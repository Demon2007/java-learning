import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Code2, Code, Layers, Star, Trophy, Users, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { useT } from "@/hooks/useT";
import useLangStore from "@/store/langStore";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const statIcons = [Users, BookOpen, Trophy, Code];
const featureIcons = [Zap, Code2, Trophy];
const featureColors = ["#7c3aed", "#2563eb", "#059669"];
const roadmapColors = ["#7c3aed", "#2563eb", "#059669", "#f59e0b", "#ef4444"];

export default function LandingPage() {
  const t = useT();
  const { lang, toggle } = useLangStore();

  const stats = [
    { icon: Users, value: "10,000+", label: t("landing.stats.learners") },
    { icon: BookOpen, value: "500+", label: t("landing.stats.lessons") },
    { icon: Trophy, value: "50+", label: t("landing.stats.achievements") },
    { icon: Code, value: "100%", label: t("landing.stats.free") },
  ];

  const features = t("landing.features");
  const roadmap = t("landing.roadmap");

  return (
    <div className="min-h-screen bg-deep overflow-hidden">
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
        style={{ background: "rgba(15,15,26,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(124,58,237,0.15)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg gradient-bg flex items-center justify-center glow-purple-sm">
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-bold text-base sm:text-lg gradient-text">JavaQuest</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all hover:scale-105"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a855f7" }}
          >
            {lang === "en" ? "🇷🇺 RU" : "🇬🇧 EN"}
          </button>
          <Link to="/login"><Button variant="ghost" size="sm">{t("landing.login")}</Button></Link>
          <Link to="/register"><Button size="sm">{lang === "en" ? "Get Started" : "Начать"}</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #2563eb, transparent)" }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6"
              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-bright" />
              <span className="text-purple-bright">{t("landing.badge")}</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 leading-tight"
          >
            {t("landing.title1")}{" "}
            <span className="gradient-text">{t("landing.title2")}</span>
            <br />{t("landing.title3")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
          >
            {t("landing.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="xl" className="glow-purple w-full sm:w-auto">{t("landing.start")}</Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto">{t("landing.login")}</Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="card-base p-3 sm:p-4 text-center">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-bright mx-auto mb-1 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-black gradient-text">{value}</p>
                <p className="text-[10px] sm:text-xs text-muted">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4">
        <motion.div {...fadeUp} className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4">{t("landing.why_title")}</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">{t("landing.why_sub")}</p>
        </motion.div>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ delay: i * 0.15 }}
              className="card-base p-5 sm:p-6 hover:border-purple-primary/50 transition-all duration-300"
              style={i === 1 ? { borderColor: "rgba(124,58,237,0.4)", boxShadow: "0 0 30px rgba(124,58,237,0.15)" } : {}}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                style={{ background: `${featureColors[i]}20`, border: `1px solid ${featureColors[i]}40` }}
              >
                {i === 0 && <Zap className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: featureColors[i] }} />}
                {i === 1 && <Code2 className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: featureColors[i] }} />}
                {i === 2 && <Trophy className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: featureColors[i] }} />}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 sm:py-24 px-4" style={{ background: "rgba(124,58,237,0.04)" }}>
        <motion.div {...fadeUp} className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4">{t("landing.roadmap_title")}</h2>
          <p className="text-gray-400 text-sm sm:text-base">{t("landing.roadmap_sub")}</p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          {roadmap.map((item, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-base sm:text-lg flex-shrink-0 text-white"
                style={{ background: `linear-gradient(135deg, ${roadmapColors[i]}, ${roadmapColors[i]}99)`, boxShadow: `0 0 20px ${roadmapColors[i]}40` }}
              >
                {i + 1}
              </div>
              <div className="card-base p-3 sm:p-4 flex-1 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted">{item.desc}</p>
                </div>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0 ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4">{t("landing.cta_title")}</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">{t("landing.cta_sub")}</p>
          <Link to="/register">
            <Button size="xl" className="glow-purple">{t("landing.cta_btn")}</Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-primary/15 py-6 sm:py-8 px-4 text-center text-xs sm:text-sm text-muted">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Code2 className="w-4 h-4 text-purple-bright" />
          <span className="font-semibold text-white">JavaQuest</span>
        </div>
        <p>{t("landing.footer")}</p>
      </footer>
    </div>
  );
}
