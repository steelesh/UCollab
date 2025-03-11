'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

export function FloatingNavWrapper({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    const previous = scrollYProgress.getPrevious();
    if (typeof previous === 'number') {
      const direction = current - previous;

      if (scrollYProgress.get() > 0.05) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="fixed top-0 right-0 left-0 z-50">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
