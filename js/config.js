// Single source of truth for site-wide data.
// Edit this file to update site-wide details across every page.
window.DEJU = {
  whatsappNumber: '6282340889808',
  whatsappDisplay: '+62 823 4088 9808',
  instagram: 'dejustudio',
  instagramUrl: 'https://instagram.com/dejustudio',
  email: 'contact.desty@gmail.com',
  address: {
    line1: 'Jl. Tirta Tawar, Petulu',
    line2: 'Ubud, Bali 80571',
    country: 'Indonesia',
  },
  hours: [
    { days: 'Saturday - Thursday', time: 'By appointment' },
    { days: 'Friday', time: 'Closed' },
  ],
  mapEmbedSrc: 'https://www.google.com/maps?q=DEJU+STUDIO+Jl.+Tirta+Tawar+Petulu+Ubud+Bali+80571&output=embed',
  mapsUrl: 'https://maps.google.com/?q=DEJU+STUDIO+Jl.+Tirta+Tawar+Petulu+Ubud+Bali+80571',
  googleBusinessUrl: 'https://share.google/qd7wFZgxsEgsR4bjJ',

  // Pre-filled WhatsApp message templates.
  // Generic falls back when no service slug is provided.
  whatsappTemplates: {
    generic: "Hi Deju, I'd like to book an appointment. Could you share availability?",
    'manicure': "Hi Deju, I'd like to book a Manicure. Could you share availability?",
    'spa-manicure': "Hi Deju, I'd like to book a Spa Manicure. Could you share availability?",
    'gel-manicure': "Hi Deju, I'd like to book a Gel Manicure. Could you share availability?",
    'hard-gel-manicure': "Hi Deju, I'd like to book a Hard Gel Manicure. Could you share availability?",
    'biab-manicure': "Hi Deju, I'd like to book a BIAB Manicure. Could you share availability?",
    'soft-tip-gel-x': "Hi Deju, I'd like to book Soft Tip / Gel-X extensions. Could you share availability?",
    'tip-overlay': "Hi Deju, I'd like to book Tip Overlay extensions. Could you share availability?",
    'polygel': "Hi Deju, I'd like to book Polygel extensions. Could you share availability?",
    'sculpture': "Hi Deju, I'd like to book Sculpture extensions. Could you share availability?",
    'pedicure': "Hi Deju, I'd like to book a Pedicure. Could you share availability?",
    'spa-pedicure': "Hi Deju, I'd like to book a Spa Pedicure. Could you share availability?",
    'gel-pedicure': "Hi Deju, I'd like to book a Gel Pedicure. Could you share availability?",
    'biab-pedicure': "Hi Deju, I'd like to book a BIAB Pedicure. Could you share availability?",
    'nail-art': "Hi Deju, I'd like to book a Nail Art appointment. Could you share availability?",
    'press-on-nails': "Hi Deju, I'd like to order custom Press On Nails. Here's the design I have in mind:",
  },

  analytics: {
    ga4Id: 'G-BZ8DVJJCNE',
    googleAdsId: 'AW-11529975683',
    conversionLabel: 'tzL7CKzm76McEIPv9fkq',
  },

  // Partners with referral attribution. Map ?ref=<slug> -> display name.
  // The display name is appended to WhatsApp messages so the studio can see
  // which partner the inquiry came from and pay commission accordingly.
  partnerNames: {
    'padma-warung': 'Padma Warung',
  },
};
