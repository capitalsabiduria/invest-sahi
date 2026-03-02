export type Institution = {
  id: string;
  name: string;
  city: string;
  type: string;
  baseCost: number;
  icon: 'GraduationCap' | 'Stethoscope' | 'Briefcase' | 'BookOpen';
};

export const INSTITUTIONS: Institution[] = [
  { id: 'nit', name: 'NIT Rourkela', city: 'Rourkela', type: 'Engineering', baseCost: 600000, icon: 'GraduationCap' },
  { id: 'aiims', name: 'AIIMS Bhubaneswar', city: 'Bhubaneswar', type: 'Medical', baseCost: 400000, icon: 'Stethoscope' },
  { id: 'iit', name: 'IIT Bhubaneswar', city: 'Bhubaneswar', type: 'Engineering', baseCost: 800000, icon: 'GraduationCap' },
  { id: 'vssut', name: 'VSSUT Burla', city: 'Burla', type: 'Engineering', baseCost: 500000, icon: 'GraduationCap' },
  { id: 'scb', name: 'SCB Medical', city: 'Cuttack', type: 'Medical', baseCost: 350000, icon: 'Stethoscope' },
  { id: 'private', name: 'Private Engineering', city: 'Various', type: 'Engineering', baseCost: 1200000, icon: 'GraduationCap' },
  { id: 'mba', name: 'MBA', city: 'Various', type: 'Management', baseCost: 1500000, icon: 'Briefcase' },
  { id: 'other', name: 'Other', city: '', type: 'Other', baseCost: 800000, icon: 'BookOpen' },
];

export const INSTITUTION_COSTS = INSTITUTIONS.reduce<Record<string, number>>((acc, institution) => {
  acc[institution.name] = institution.baseCost;
  return acc;
}, {});
