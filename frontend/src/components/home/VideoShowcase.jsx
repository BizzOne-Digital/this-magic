import SectionHeading from '../SectionHeading';
import Button from '../Button';
import { PHONE_TEL } from '../../constants/site';

export const defaultVideos = [
  {
    title: 'Wedding Demo',
    category: 'Weddings',
    youtubeId: 'ntdPtc-SOTE',
    url: 'https://www.youtube.com/watch?v=ntdPtc-SOTE',
    description:
      'Watch DJ Adam in action at a real wedding — packed dance floor, seamless transitions, and the perfect mix of romance and celebration.',
  },
  {
    title: 'Bar & Bat Mitzvah Demo',
    category: 'Bar/Bat Mitzvah',
    youtubeId: 'mRQQWw7fG8Y',
    url: 'https://www.youtube.com/watch?v=mRQQWw7fG8Y',
    description:
      'NJ\'s favorite DJ bringing high-energy entertainment to Bar and Bat Mitzvah celebrations — crowd interaction, age-appropriate music, and unforgettable moments.',
  },
  {
    title: 'Sweet 16 DJ Video',
    category: 'Sweet 16',
    youtubeId: 'jEjG_ehduc4',
    url: 'https://www.youtube.com/watch?v=jEjG_ehduc4',
    description:
      'Experience the energy of a Sweet 16 party with DJ Adam — current hits, epic dance floor moments, and a celebration your teen will never forget.',
  },
];

const VideoShowcase = ({ content, showCta = true }) => {
  const section = content?.videos || {};
  const videos = section.items?.length ? section.items : defaultVideos;

  return (
    <section className="section-padding bg-navy">
      <div className="container-custom">
        <SectionHeading
          scriptAccent={section.scriptAccent || 'Watch the Energy'}
          title={section.title || 'See The Magic In Action'}
          subtitle={
            section.subtitle ||
            'Real event footage from weddings, Sweet 16s, and Bar & Bat Mitzvah celebrations across New Jersey. See why couples, families, and event planners trust DJ Adam to deliver unforgettable entertainment.'
          }
          light
        />

        <div className="space-y-16">
          {videos.map((video, index) => (
            <article
              key={video.youtubeId || video.url || index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Video embed — full width within its column */}
              <div
                className={`w-full ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                    title={video.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <span className="inline-block bg-teal/20 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  {video.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">
                  {video.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">{video.description}</p>
                <a
                  href={video.url || `https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal text-sm font-semibold hover:underline"
                >
                  Watch on YouTube →
                </a>
              </div>
            </article>
          ))}
        </div>

        {showCta && (
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Ready to create your own unforgettable moment? Call or text DJ Adam for your wedding, Sweet 16, Bar/Bat
              Mitzvah, or private celebration.
            </p>
            <Button href={`tel:${PHONE_TEL}`} variant="primary">
              Call or Text DJ Adam Today
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoShowcase;
