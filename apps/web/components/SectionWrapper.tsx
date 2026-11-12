"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { styles } from "@/lib/constants";
import { staggerContainer } from "@/lib/motion";

type Props = { id?: string; children: ReactNode };

export default function SectionWrapper({ id, children }: Props) {
  return (
    <motion.section
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
    >
      <span className="hash-span" id={id}>
        &nbsp;
      </span>
      {children}
    </motion.section>
  );
}
