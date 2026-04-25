"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  Flag,
  BadgeCheck,
  BookOpen,
  MessageSquare,
  Zap,
  Lock,
  MapPin,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const keyFeatures = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    desc: "Our advanced AI analyzes CVs and matches candidates with job opportunities based on compatibility.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Companies",
    desc: "All companies are verified through document review to ensure authenticity.",
  },
  {
    icon: Flag,
    title: "Localized for Algeria",
    desc: "Support for algerian wilayas, contract types (CDI, CDD? Internship, Freelance), and local business practices.",
  },
  {
    icon: BadgeCheck,
    title: "Skill Validation",
    desc: "Domain-specific QCM tests to validate your skills and knowledge.",
  },
  {
    icon: BookOpen,
    title: "Training Programs",
    desc: "Post-recruitment training content to help candidates excel in their new roles.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    desc: "Integrated chat for seamless communication.",
  },
];

const whyChoose = [
  {
    icon: Zap,
    title: "Smart Matching",
    desc: "AI analyzes your profile and calculates compatibility scores to find the best job fits for you.",
  },
  {
    icon: Lock,
    title: "Secure & Verified",
    desc: "Every company goes through a rigorous verification process with admin approval before posting jobs.",
  },
  {
    icon: MapPin,
    title: "Made for Algeria",
    desc: "Designed from the ground up for the Algerian job market with local context and requirements.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Access training programs, validate your skills, and track your professional development.",
  },
];

export default function AboutPage() {
  const [supportEmail, setSupportEmail] = useState("cvision.platform@gmail.com");

  useEffect(() => {
    fetch(`${API_URL}/settings`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.supportEmail) setSupportEmail(data.supportEmail);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-background via-white to-cvision-green-bg relative">
        <div className="absolute top-20 right-10 w-72 h-72 bg-cvision-green/10 rounded-full blur-3xl" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-cvision-green">CVision</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              CVision is a cuttin-edge recruitment solution designed specifically for the Algerian market . Our mission is to digitalize and modernize the recruitment progress , connecting talented job seekers with verified companies across Algeria .
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To become the leading recruitment platform in algeria, providing innovative solutions that leverage artificial intelligence to match candidates with the right opportunities, while ensuring transparency, efficiency, a,d quality in the hiring process .
              </p>
              
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "69", label: "Wilayas Covered" },
                { value: "AI", label: "Powered Matching" },
                { value: "100%", label: "Verified Companies" },
                { value: "24/7", label: "Platform Access" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-cvision-container rounded-xl border border-border p-6 text-center"
                >
                  <p className="text-2xl font-bold text-cvision-green mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
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
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful tools designed to streamline recruitment in Algeria.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {keyFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={staggerItemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl border border-border p-6"
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
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {whyChoose.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={staggerItemVariants}
                  className="text-center p-6 rounded-xl bg-cvision-container border border-border"
                >
                  <div className="w-14 h-14 rounded-full bg-cvision-green text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cvision-green/25">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Contact Us
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="flex items-center gap-3 text-white/90">
              <Mail className="w-5 h-5" />
              <span>{supportEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Phone className="w-5 h-5" />
              <span>+213 6 XX XX XX XX</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register/candidate">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base bg-white text-cvision-green hover:bg-gray-100"
              >
                Get Started as Candidate
              </Button>
            </Link>
            <Link href="/register/company">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base bg-white text-cvision-green hover:bg-gray-100"
              >
                Get Started as Employer
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
