import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'investsahi-settings';

const defaultSettings = {
  whatsapp: '',
  address: '',
  amfi_arn: '',
  irdai_reg: '',
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast({ title: 'Settings saved', description: 'Your settings have been saved locally.' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Settings</h1>
      <p className="text-sm text-stone/50 mb-6">Full settings management coming soon. Settings are stored locally for now.</p>

      <div className="grid gap-6 max-w-xl">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <Label>WhatsApp Number</Label>
            <Input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <Label>Office Address</Label>
            <Textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder="Your office address" />
          </div>
          <div>
            <Label>AMFI ARN Number</Label>
            <Input value={settings.amfi_arn} onChange={(e) => setSettings({ ...settings, amfi_arn: e.target.value })} placeholder="ARN-XXXXX" />
          </div>
          <div>
            <Label>IRDAI Registration Number</Label>
            <Input value={settings.irdai_reg} onChange={(e) => setSettings({ ...settings, irdai_reg: e.target.value })} placeholder="IRDAI-XXXXX" />
          </div>
          <Button onClick={handleSave} className="bg-saffron hover:bg-saffron/90 text-white">Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
