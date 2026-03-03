import { ChevronUp } from 'lucide-react';

interface BackToTopButtonProps {
  visible: boolean;
  onClick: () => void;
}

export default function BackToTopButton({ visible, onClick }: BackToTopButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Back to top"
      className={`
        fixed z-50 w-10 h-10 rounded-full bg-primary text-primary-foreground
        flex items-center justify-center shadow-lg
        transition-all duration-300 hover:scale-110
        bottom-24 md:bottom-8 right-4 md:right-6
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <ChevronUp size={20} />
    </button>
  );
}
