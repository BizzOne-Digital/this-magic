import SectionHeading from '../SectionHeading';
import Button from '../Button';
import { PHONE_TEL, WEDDING_DEMO } from '../../constants/site';

export const defaultVideos = [
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

const VideoEmbed = ({ video }) => {
  if (video.videoSrc) {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover bg-black"
        poster={video.poster}
      >
        <source src={video.videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (video.youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
        title={video.title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return null;
};

const buildVideoList = (section) => {
  const cmsVideos = section.items?.length ? section.items : defaultVideos;
  const withoutYoutubeWedding = cmsVideos.filter(
    (video) => !(video.youtubeId === 'ntdPtc-SOTE' || video.title?.toLowerCase() === 'wedding demo')
  );
  return [WEDDING_DEMO, ...withoutYoutubeWedding];
};

const VideoShowcase = ({ content, showCta = true }) => {
  const section = content?.videos || {};
  const videos = buildVideoList(section);

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
              key={video.videoSrc || video.youtubeId || video.url || index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`w-full ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                  <VideoEmbed video={video} />
                </div>
              </div>

              <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <span className="inline-block bg-teal/20 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  {video.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">
                  {video.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">{video.description}</p>
                {video.url && !video.videoSrc && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal text-sm font-semibold hover:underline"
                  >
                    Watch on YouTube →
                  </a>
                )}
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
