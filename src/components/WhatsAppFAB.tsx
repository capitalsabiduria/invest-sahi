import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/config/constants';

const WhatsAppFAB = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full hidden lg:flex items-center justify-center shadow-lg animate-pulse"
    style={{ backgroundColor: '#25D366' }}
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={28} className="text-white" fill="white" />
  </a>
);

export default WhatsAppFAB;
