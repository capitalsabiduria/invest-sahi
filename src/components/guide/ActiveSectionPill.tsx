interface ActiveSectionPillProps {
  label: string | null;
}

const SECTION_LABELS: Record<string, string> = {
  'guide-hero': 'Overview',
  'guide-story': 'Story',
  'guide-case-study': 'Case Study',
  'guide-how-it-works': 'How It Works',
  'guide-why': 'Why Choose Us',
  'guide-local-insight': 'Local Insight',
  'guide-services': 'Services',
  'guide-faqs': 'FAQs',
  'guide-trust': 'Trust',
  'guide-cta': 'Get Started',
};

export default function ActiveSectionPill({ label }: ActiveSectionPillProps) {
  const displayLabel = label ? SECTION_LABELS[label] || label : null;

  if (!displayLabel) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-foreground/80 text-background font-body text-xs px-4 py-1.5 rounded-full backdrop-blur-sm shadow-md animate-fade-in">
        Reading: {displayLabel}
      </div>
    </div>
  );
}
