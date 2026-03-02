import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type RevealSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const RevealSection = ({ children, className = '', delay = 0 }: RevealSectionProps) => {
  const { ref, visible } = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default RevealSection;
