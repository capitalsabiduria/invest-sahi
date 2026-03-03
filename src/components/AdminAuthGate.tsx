import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'investsahi-admin-2026';

interface AdminAuthGateProps {
  children: React.ReactNode;
}

const AdminAuthGate = ({ children }: AdminAuthGateProps) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem('investsahi_admin_authed') === 'true';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('investsahi_admin_authed', 'true');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={22} className="text-saffron" />
          </div>
          <h1 className="font-heading font-bold text-xl text-foreground">
            InvestSahi Admin
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Enter your admin password to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Admin password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            className={error ? 'border-red-400 focus-visible:ring-red-400' : ''}
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-500 font-body">
              Incorrect password. Try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-saffron text-white font-heading font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Enter Admin Panel
          </button>
        </form>
        <p className="text-xs text-muted-foreground text-center font-body mt-4">
          Session expires when you close the browser tab.
        </p>
      </div>
    </div>
  );
};

export default AdminAuthGate;
