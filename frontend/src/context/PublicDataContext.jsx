import { createContext, useContext, useEffect, useState, startTransition } from 'react';
import snapshot from '../data/public-content.json';
import { normalizePublicData } from '../data/normalize-public';
import { contentAPI, servicesAPI, testimonialsAPI, promotionsAPI, galleryAPI } from '../services/api';

const PublicDataContext = createContext(snapshot);

// The same approved snapshot powers the first browser render and the build's HTML.
// Refresh each feed independently so an unavailable API never empties the page.
export const PublicDataProvider = ({ children }) => {
  const [data, setData] = useState(snapshot);
  useEffect(() => {
    let active = true;
    const feeds = {
      content: () => contentAPI.get(),
      services: () => servicesAPI.getAll(),
      testimonials: () => testimonialsAPI.getAll(),
      promotions: () => promotionsAPI.getAll(),
      gallery: () => galleryAPI.getAll({ limit: 8 }),
    };
    for (const [key, request] of Object.entries(feeds)) {
      request().then(({ data: response }) => {
        const value = response.data;
        if (active && response.success && (key === 'content' ? value && !Array.isArray(value) : Array.isArray(value))) {
          startTransition(() => setData((previous) => ({ ...previous, [key]: normalizePublicData(key, value, snapshot) })));
        }
      }).catch((error) => console.warn(`Could not refresh ${key}; using published content.`, error.message));
    }
    return () => { active = false; };
  }, []);
  return <PublicDataContext.Provider value={data}>{children}</PublicDataContext.Provider>;
};

export const usePublicData = () => useContext(PublicDataContext);
