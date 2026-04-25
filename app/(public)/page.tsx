"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import {
  Flag,
  Sparkles,
  ShieldCheck,
  BookOpen,
  BadgeCheck,
  Lock,
  User,
  Brain,
  ClipboardList,
  Trophy,
  ArrowRight,
} from "lucide-react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import { AdCarousel } from "@/components/sections/AdCarousel";

const features = [
  {
    icon: Flag,
    title: "Localized for Algeria",
    desc: "Built specifically for the Algerian market with support for all 69 wilayas.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    desc: "Automatic CV analysis and smart job recommendations based on compatibility.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Companies",
    desc: "All companies are verified through document review to ensure authenticity.",
  },
  {
    icon: BookOpen,
    title: "Training Programs",
    desc: "Access training modules to develop your skills and advance your career.",
  },
  {
    icon: BadgeCheck,
    title: "Skill Validation",
    desc: "Domain-specific QCM tests to validate your skills and knowledge.",
  },
  {
    icon: Lock,
    title: "Data Privacy & Security",
    desc: "Protectiong user data according to fundamental security practices.",
  },
];

const steps = [
  {
    icon: User,
    title: "Complete Profile",
    desc: "Register as a job seeker or company and complete your profile.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Our AI analyzes your CV and matches you with relevant opportunities.",
  },
  {
    icon: ClipboardList,
    title: "Apply & Test",
    desc: "Apply for jobs and complete required skills tests.",
  },
  {
    icon: Trophy,
    title: "Get Hired & Train",
    desc: "Get accepted and access training programs to excel in your new role.",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".hero-cta",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out",
          },
          "-=0.4"
        )
;
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-24 md:py-32 px-4 bg-gradient-to-br from-background via-white to-cvision-green-bg"
      >
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cvision-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cvision-blue/5 rounded-full blur-3xl" />

        <div className="max-w-[1280px] mx-auto text-center relative z-10">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Connecting Job Seekers and
            <br />
            Companies in{" "}
            <span className="text-cvision-green relative">
              Algeria
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 8 Q50 2 100 6 Q150 10 198 4"
                  stroke="#00C897"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.4"
                />
              </svg>
            </span>
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            AI-powered recruitment platform with smart job matching , CV analysis , online tests , and training programs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/register/candidate" className="hero-cta">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                Job Search
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register/company" className="hero-cta">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
              >
                Post a Job
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Why Choose CVision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose CVision?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need for a successful recruitment experience in
              Algeria.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={staggerItemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-cvision-container rounded-xl border border-border p-6 cursor-default"
                >
                  <div className="w-12 h-12 rounded-lg bg-cvision-green-bg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-cvision-green" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get started in 4 simple steps.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8"
            >
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    variants={staggerItemVariants}
                    className="text-center relative"
                  >
                    <div className="w-16 h-16 rounded-full bg-cvision-green text-white flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg shadow-cvision-green/25">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-cvision-green mb-2 block">
                      STEP {i + 1}
                    </span>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ad Carousel Section */}
      <AdCarousel />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cvision-green to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1280px] mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-10 text-lg">
            Join thousands of professionals and companies building Algeria&apos;s
            future workforce.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register/candidate">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base bg-white text-cvision-green hover:bg-gray-100"
              >
                Create Account as Candidate
              </Button>
            </Link>
            <Link href="/register/company">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base bg-white text-cvision-green hover:bg-gray-100"
              >
                Create Account as Company
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
