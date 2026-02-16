"use client";

import { motion } from "framer-motion";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
