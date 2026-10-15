import { test } from 'node:test';
import assert from 'node:assert/strict';
import Gallery from '../src/models/Gallery.js';
import Testimonial from '../src/models/Testimonial.js';
import { realTestimonials } from '../src/data/realTestimonials.js';
import { parseTestimonialBody } from '../src/utils/parseBody.js';
import { GALLERY_TEXT_BY_ID_PREFIX } from '../src/data/galleryDescriptions.js';

test('all eight legacy gallery IDs serialize as the audited captions and alt text', () => {
  for (const [prefix, text] of Object.entries(GALLERY_TEXT_BY_ID_PREFIX)) {
    const item = new Gallery({ title: `${prefix} 5a9c 4c54 8db3 4259b101553c`, imageUrl: 'https://example.com/photo.jpg', publicId: 'photo' }).toJSON();
    assert.equal(item.title, text.caption);
    assert.equal(item.caption, text.alt);
  }
});

test('an editor-provided gallery title and scene description stay intact', () => {
  const item = new Gallery({ title: 'Family dance', caption: 'Guests dancing together', imageUrl: 'https://example.com/photo.jpg', publicId: 'photo' }).toJSON();
  assert.equal(item.title, 'Family dance');
  assert.equal(item.caption, 'Guests dancing together');
});

test('known email reviews have truthful provenance without inventing dates or permalinks', () => {
  const review = new Testimonial(realTestimonials[0]).toJSON();
  assert.equal(review.sourceLabel, 'Client feedback shared by email');
  assert.equal(review.reviewDate, undefined);
  assert.equal(review.sourceUrl, '');
});

test('review source URLs reject script URLs and accept a public permalink', () => {
  const unsafe = new Testimonial({ ...realTestimonials[0], sourceUrl: 'javascript:alert(1)' });
  assert.ok(unsafe.validateSync().errors.sourceUrl);
  const safe = new Testimonial({ ...realTestimonials[0], sourceUrl: 'https://www.theknot.com/example/review' });
  assert.equal(safe.validateSync(), undefined);
});

test('clearing an unknown review or event date does not turn it into a fabricated date', () => {
  const parsed = parseTestimonialBody({ eventDate: '', reviewDate: '', isFeatured: 'false', rating: '5' });
  assert.equal(parsed.eventDate, null);
  assert.equal(parsed.reviewDate, null);
  assert.equal(parsed.isFeatured, false);
  assert.equal(parsed.rating, 5);
});
