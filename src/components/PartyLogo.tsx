import React from 'react';

// Authentic Official Moroccan Political Parties Logos
import pamLogo from '../assets/images/real_pam_logo.png';
import rniLogo from '../assets/images/real_rni_logo.png';
import piLogo from '../assets/images/real_pi_logo.png';
import pjdLogo from '../assets/images/real_pjd_logo.png';
import mpLogo from '../assets/images/real_mp_logo.png';
import usfpLogo from '../assets/images/real_usfp_logo.png';
import ppsLogo from '../assets/images/real_pps_logo.png';
import ucLogo from '../assets/images/real_uc_logo.png';
import fgdLogo from '../assets/images/fgd_official_logo_1790225092047.jpg';
import mdsLogo from '../assets/images/mds_official_logo_1790225106421.jpg';
import ffdLogo from '../assets/images/ffd_official_logo_1790233705253.jpg';
import inssafLogo from '../assets/images/inssaf_official_logo_1790233715943.jpg';
import mndLogo from '../assets/images/mnd_official_logo_1790233727574.jpg';
import pudLogo from '../assets/images/pud_official_logo_1790233738583.jpg';

interface PartyLogoProps {
  code: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBg?: boolean;
}

export const PartyLogo: React.FC<PartyLogoProps> = ({
  code,
  size = 'md',
  className = '',
  showBg = true,
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5 min-w-[20px]',
    sm: 'w-7 h-7 min-w-[28px]',
    md: 'w-9 h-9 min-w-[36px]',
    lg: 'w-12 h-12 min-w-[48px]',
    xl: 'w-16 h-16 min-w-[64px]',
  };

  const normalized = (code || '').toUpperCase().trim();

  // Map to the official party logo images
  const getPartyImage = (): { src: string; nameAr: string } => {
    switch (normalized) {
      case 'PAM':
        return {
          src: pamLogo,
          nameAr: 'حزب الأصالة والمعاصرة',
        };
      case 'RNI':
        return {
          src: rniLogo,
          nameAr: 'التجمع الوطني للأحرار',
        };
      case 'PI':
        return {
          src: piLogo,
          nameAr: 'حزب الاستقلال',
        };
      case 'PJD':
        return {
          src: pjdLogo,
          nameAr: 'حزب العدالة والتنمية',
        };
      case 'MP':
        return {
          src: mpLogo,
          nameAr: 'الحركة الشعبية',
        };
      case 'USFP':
        return {
          src: usfpLogo,
          nameAr: 'الاتحاد الاشتراكي للقوات الشعبية',
        };
      case 'PPS':
        return {
          src: ppsLogo,
          nameAr: 'حزب التقدم والاشتراكية',
        };
      case 'UC':
        return {
          src: ucLogo,
          nameAr: 'الاتحاد الدستوري',
        };
      case 'FGD':
      case 'FGD/PSU':
      case 'FGD_PSU':
      case 'PSU':
        return {
          src: fgdLogo,
          nameAr: 'تحالف فيدرالية اليسار',
        };
      case 'MDS':
        return {
          src: mdsLogo,
          nameAr: 'الحركة الديمقراطية الاجتماعية',
        };
      case 'FFD':
        return {
          src: ffdLogo,
          nameAr: 'جبهة القوى الديمقراطية',
        };
      case 'INSSAF':
      case 'AL_INSSAF':
        return {
          src: inssafLogo,
          nameAr: 'حزب الإنصاف',
        };
      case 'MND':
      case 'NEO_DEM':
        return {
          src: mndLogo,
          nameAr: 'حزب الديمقراطيين الجدد',
        };
      case 'PUD':
        return {
          src: pudLogo,
          nameAr: 'حزب الوحدة والديمقراطية',
        };
      default:
        return {
          src: pamLogo,
          nameAr: 'حزب مغربي معتمد',
        };
    }
  };

  const partyImageInfo = getPartyImage();

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden transition-transform hover:scale-105 ${
        sizeClasses[size]
      } ${showBg ? 'ring-1 ring-slate-300 dark:ring-slate-700/80 shadow-sm bg-white p-0.5' : ''} ${className}`}
      title={partyImageInfo.nameAr}
    >
      <img
        src={partyImageInfo.src}
        alt={`شعار ${partyImageInfo.nameAr}`}
        className="w-full h-full object-contain rounded-full select-none"
        loading="lazy"
      />
    </div>
  );
};

export const getPartyFullName = (code: string): string => {
  const normalized = (code || '').toUpperCase().trim();
  switch (normalized) {
    case 'PAM':
      return 'حزب الأصالة والمعاصرة';
    case 'RNI':
      return 'التجمع الوطني للأحرار';
    case 'PI':
      return 'حزب الاستقلال';
    case 'PJD':
      return 'حزب العدالة والتنمية';
    case 'MP':
      return 'الحركة الشعبية';
    case 'USFP':
      return 'الاتحاد الاشتراكي للقوات الشعبية';
    case 'PPS':
      return 'حزب التقدم والاشتراكية';
    case 'UC':
      return 'الاتحاد الدستوري';
    case 'FGD':
    case 'FGD/PSU':
    case 'FGD_PSU':
    case 'PSU':
      return 'تحالف فيدرالية اليسار';
    case 'MDS':
      return 'الحركة الديمقراطية الاجتماعية';
    case 'FFD':
      return 'جبهة القوى الديمقراطية';
    case 'INSSAF':
    case 'AL_INSSAF':
      return 'حزب الإنصاف';
    case 'MND':
    case 'NEO_DEM':
      return 'حزب الديمقراطيين الجدد';
    case 'PUD':
      return 'حزب الوحدة والديمقراطية';
    default:
      return code;
  }
};

