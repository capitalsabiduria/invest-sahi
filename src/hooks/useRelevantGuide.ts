import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Guide = { title_en: string; slug: string } | null;

const CATEGORY_MAP: Record<string, string[]> = {
  home: ['Loans', 'Savings', 'Credit'],
  education: ['Mutual Funds', 'SIP', 'Savings'],
  retirement: ['Retirement', 'NPS', 'Mutual Funds'],
  wealth: ['Mutual Funds', 'SIP', 'Savings'],
};

export function useRelevantGuide(calculatorType: 'home' | 'education' | 'retirement' | 'wealth', lang: string = 'en') {
  const [guide, setGuide] = useState<Guide>(null);

  useEffect(() => {
    const categories = CATEGORY_MAP[calculatorType];
    supabase
      .from('content_items')
      .select('title_en, title_or, slug')
      .eq('status', 'published')
      .eq('type', 'guide')
      .in('category', categories)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setGuide({
          title_en: lang === 'or' && (data as any).title_or ? (data as any).title_or : data.title_en,
          slug: data.slug,
        });
      });
  }, [calculatorType, lang]);

  return guide;
}
