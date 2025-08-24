// src/components/FadeIn.jsx
import { motion } from 'framer-motion';

function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and slightly down
      whileInView={{ opacity: 1, y: 0 }} // Animate to visible and original position
      viewport={{ once: true }} // Only animate once
      transition={{ duration: 0.8 }} // Animation speed
    >
      {children}
    </motion.div>
  );
}
export default FadeIn;