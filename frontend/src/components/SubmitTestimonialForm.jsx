import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiStar, FiMapPin, FiMessageSquare, FiUpload, FiImage } from 'react-icons/fi';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import StarRating from './StarRating';
import { testimonialsAPI } from '../services/api';
import { buildFormData, EVENT_TYPES } from '../utils/helpers';

const initialForm = {
  clientName: '',
  eventType: '',
  rating: 5,
  review: '',
  location: '',
  image: null,
};

const SubmitTestimonialForm = () => {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName || !form.eventType || !form.review) {
      toast.error('Please fill in name, event type, and your review.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = buildFormData(form);
      const res = await testimonialsAPI.submit(formData);
      toast.success(res.data.message || 'Review submitted! It will appear after approval.');
      setForm(initialForm);
      setPreview('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-10">
          <p className="heading-script text-2xl text-teal mb-2">Share Your Experience</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy uppercase tracking-tight mb-4">
            Submit Your Review
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Had an amazing event with Adam? Share your story and photo! Your review will be reviewed by our team
            before appearing on the website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-10 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                <FiUser className="inline mr-1" /> Your Name *
              </label>
              <input
                name="clientName"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="input-field"
                placeholder="Your name or couple name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Event Type *</label>
              <select
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                className="input-field"
              >
                <option value="">Select event type</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                <FiStar className="inline mr-1" /> Rating *
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={form.rating}
                  size="md"
                  interactive
                  onChange={(r) => setForm({ ...form, rating: r })}
                />
                <span className="text-sm text-gray-500">{form.rating} / 5</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                <FiMapPin className="inline mr-1" /> Location
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input-field"
                placeholder="City, NJ"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              <FiMessageSquare className="inline mr-1" /> Your Review *
            </label>
            <textarea
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              rows={5}
              className="input-field resize-none"
              placeholder="Tell us about your experience with Adam Aronow..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              <FiImage className="inline mr-1" /> Event Photo (optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {preview && (
                <img src={preview} alt="Preview" className="w-32 h-32 rounded-xl object-contain bg-gray-100 border" />
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-teal hover:text-teal transition-colors"
              >
                <FiUpload />
                {preview ? 'Change Photo' : 'Upload Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto justify-center">
            {submitting ? <LoadingSpinner size="sm" /> : 'Submit Review'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default SubmitTestimonialForm;
