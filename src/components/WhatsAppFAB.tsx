import { MessageCircle } from 'lucide-react';

const WhatsAppFAB = () => (
  <a
    href="https://wa.me/919876543210"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-pulse"
    style={{ backgroundColor: '#25D366' }}
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={28} className="text-white" fill="white" />
  </a>
);

export default WhatsAppFAB;
