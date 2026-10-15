// Scene descriptions verified in the client SEO audit.
export const GALLERY_TEXT_BY_ID_PREFIX = {
  '669a0515': { alt: 'Guests dancing in a ballroom under blue uplighting', caption: 'Ballroom dance floor' },
  c843e591: { alt: 'Guests posing with props at a ring-light photo booth', caption: 'Photo booth fun' },
  '76d78614': { alt: 'Birthday guest beside a cake with number 16 candles', caption: 'Sweet 16 cake moment' },
  c11896a0: { alt: 'DJ facing a crowded dance floor under blue stage lights', caption: 'DJ and dance floor' },
  '42b5e8bc': { alt: 'Wedding couple entering a ballroom with raised hands', caption: 'Wedding entrance' },
  c571b6c5: { alt: 'Party guests dancing beside DJ equipment and candlelit decor', caption: 'Dance floor celebration' },
  '4408769f': { alt: 'Friends posing in novelty glasses at a photo booth', caption: 'Photo booth memories' },
  '92ef1705': { alt: 'Guest in a blue ballgown dancing with friends', caption: 'Sweet 16 dancing' },
};

// UUID / long hex strings are file IDs, not descriptions.
const ID_LIKE = /^[0-9a-f]{8}([-\s_]?[0-9a-f]{4}){3}[-\s_]?[0-9a-f]{12}$|^(?=.*\d)[0-9a-f\s_-]{16,}$/i;
export const isIdLike = (text) => !!text && ID_LIKE.test(text.trim());

export const getGalleryText = (item) => {
  const title = item.title?.trim() || '';
  const caption = item.caption?.trim() || '';
  if (title && !isIdLike(title)) {
    return { alt: caption && !isIdLike(caption) ? caption : title, caption: title };
  }
  const known = GALLERY_TEXT_BY_ID_PREFIX[title.slice(0, 8).toLowerCase()];
  if (known) return known;
  const category = item.category && item.category !== 'General' ? item.category : 'Event';
  return { alt: `${category} celebration photo`, caption: `${category} celebration` };
};
