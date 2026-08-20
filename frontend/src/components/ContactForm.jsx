import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiMail, FiCalendar, FiMapPin, FiUsers, FiMessageSquare } from 'react-icons/fi';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { leadsAPI } from '../services/api';
import { EVENT_TYPES, SERVICE_OPTIONS, HEAR_ABOUT_OPTIONS } from '../utils/helpers';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  eventType: '',
  eventDate: '',
  eventLocation: '',
  guestCount: '',
  interestedServices: [],
  hearAboutUs: '',
  message: '',
};

const ContactForm = ({ intro, className = '' }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setForm((prev) => ({
      ...prev,
      interestedServices: prev.interestedServices.includes(service)
        ? prev.interestedServices.filter((s) => s !== service)
        : [...prev.interestedServices, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.eventType || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        guestCount: form.guestCount ? parseInt(form.guestCount, 10) : undefined,
        eventDate: form.eventDate || undefined,
      };

      const res = await leadsAPI.create(payload);
      toast.success(res.data.message || 'Thank you! We will contact you soon.');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 ${className}`}>
      {intro && (
        <p className="text-gray-600 leading-relaxed mb-8 animate-fade-in">{intro}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
              Full Name *
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-teal" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
              Phone Number *
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-teal" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="732-555-0123"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
            Email Address *
          </label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field pl-11"
              placeholder="you@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventType" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
              Event Type *
            </label>
            <select
              id="eventType"
              name="eventType"
              required
              value={form.eventType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select event type</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
              Event Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-teal" />
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={form.eventDate}
                onChange={handleChange}
                className="input-field pl-11"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventLocation" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
              Event Location
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-teal" />
              <input
                id="eventLocation"
                name="eventLocation"
                type="text"
                value={form.eventLocation}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="Venue or city"
              />
            </div>
          </div>

          <div>
            <label htmlFor="guestCount" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
              Estimated Guest Count
            </label>
            <div className="relative">
              <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-teal" />
              <input
                id="guestCount"
                name="guestCount"
                type="number"
                min="1"
                value={form.guestCount}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="150"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="block text-sm font-semibold text-navy mb-3 uppercase tracking-wide">
            Interested Services
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map((service) => (
              <label
                key={service}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  form.interestedServices.includes(service)
                    ? 'border-teal bg-teal/5'
                    : 'border-gray-200 hover:border-teal/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.interestedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="w-4 h-4 accent-teal"
                />
                <span className="text-sm text-navy">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="hearAboutUs" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
            How Did You Hear About Us?
          </label>
          <select
            id="hearAboutUs"
            name="hearAboutUs"
            value={form.hearAboutUs}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select an option</option>
            {HEAR_ABOUT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wide">
            Tell Us About Your Event *
          </label>
          <div className="relative">
            <FiMessageSquare className="absolute left-4 top-4 text-teal" />
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="input-field pl-11 resize-none"
              placeholder="Share your vision, special requests, timeline details, or any questions you have..."
            />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full justify-center !py-4">
          {submitting ? (
            <>
              <LoadingSpinner size="sm" />
              Sending...
            </>
          ) : (
            'Send My Inquiry'
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to be contacted about your event. We typically respond within 24 hours.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
