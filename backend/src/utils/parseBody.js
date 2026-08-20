export const parseTestimonialBody = (body) => {
  const data = { ...body };
  if (data.isActive !== undefined) data.isActive = data.isActive === 'true' || data.isActive === true;
  if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === 'true' || data.isFeatured === true;
  if (data.isUserSubmitted !== undefined) {
    data.isUserSubmitted = data.isUserSubmitted === 'true' || data.isUserSubmitted === true;
  }
  if (data.rating) data.rating = Number(data.rating);
  if (data.order !== undefined && data.order !== '') data.order = Number(data.order);
  if (data.eventDate === '') delete data.eventDate;
  return data;
};
