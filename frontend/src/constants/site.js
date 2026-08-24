export const REVIEW_LINKS = {
  theKnot: 'https://www.theknot.com/marketplace/this-magic-moment-north-brunswick-nj-513977',
  weddingWire: 'https://www.weddingwire.com/biz/this-magic-moment-south-amboy/c6424f898c1680b5.html',
  google: 'https://www.google.com/search?q=This+Magic+Moment+DJ+Adam+New+Jersey+reviews',
};

export const PHONE_DISPLAY = '732 829 2344';
export const PHONE_TEL = '+17328292344';

export const LOGO_PATH = '/logo.png';
export const DJ_PHOTO_PATH = '/public.png';
export const WEDDING_DEMO_VIDEO = '/wedding-demo.mp4';

export const getLogoUrl = (logoUrl) =>
  logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) ? logoUrl : LOGO_PATH;

export const WEDDING_DEMO = {
  title: 'Wedding Demo',
  category: 'Weddings',
  videoSrc: WEDDING_DEMO_VIDEO,
  description:
    'Watch DJ Adam in action at a real wedding — packed dance floor, seamless transitions, and the perfect mix of romance and celebration.',
};
