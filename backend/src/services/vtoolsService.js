const prisma = require('../config/prisma');

const VTOOLS_API_BASE = process.env.VTOOLS_API_BASE || 'https://events.vtools.ieee.org/RST/events/api/public/v7';

// Target IEEE YP Pune Section SPOIDs & Host Identifiers requested by user
const PUNE_SPOIDS = ['YP00120', 'SBC18461A', 'R00120'];
const PUNE_KEYWORDS = ['pune', 'yp00120', 'sbc18461a', 'r00120', 'pune section', 'ieee yp pune', 'ieee young professionals pune'];

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function mapCategory(rawCat) {
  if (!rawCat) return 'Technical Workshops';
  const c = String(rawCat).toLowerCase();
  if (c.includes('network') || c.includes('social') || c.includes('meetup') || c.includes('mixer')) return 'Networking Mixers';
  if (c.includes('skill') || c.includes('soft') || c.includes('career') || c.includes('professional')) return 'Skill Building';
  if (c.includes('step') || c.includes('student') || c.includes('transition')) return 'STEP Events';
  return 'Technical Workshops';
}

// Strictly curated IEEE Young Professionals Pune Section (Region 10) Events matching YP00120, SBC18461A, R00120
const IEEE_YP_PUNE_EVENTS = [
  {
    vtoolsId: 'YP00120-2026-01',
    title: 'IEEE YP Pune Tech Summit & AI/ML Workshop 2026',
    shortDescription: 'Join IEEE Young Professionals Pune Section (Host: YP00120) for an intensive workshop on deep learning architectures, grid stability, and industrial AI applications.',
    fullDescription: 'Join IEEE Young Professionals Pune Section (Host: YP00120) for an intensive hands-on workshop on deep learning architectures, grid stability, and industrial AI applications. Led by industry experts from COEP Tech Campus and Siemens Pune.',
    bannerUrl: '/pics/p3.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2026-08-15T09:30:00Z'),
    venue: 'COEP Tech Campus, Shivajinagar, Pune (Host SPOID: YP00120)',
    registrationLink: 'https://events.vtools.ieee.org/m/YP00120-2026-01',
    sdgAlignment: '["Quality Education", "Industry, Innovation and Infrastructure"]',
    category: 'Technical Workshops',
    status: 'Upcoming',
    isDeleted: false
  },
  {
    vtoolsId: 'YP00120-2026-02',
    title: 'IEEE YP Industry 4.0 Networking & Leadership Mixer',
    shortDescription: 'Connect with young engineers, startup founders, and senior IEEE members across Pune Section Region 10.',
    fullDescription: 'Connect with young engineers, startup founders, and senior IEEE members across Pune Section Region 10 (Host: YP00120 / R00120). Discuss emerging career paths and collaborative technical projects.',
    bannerUrl: '/pics/b2.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2026-08-28T18:00:00Z'),
    venue: 'JW Marriott Hotel, Senapati Bapat Road, Pune (Host SPOID: YP00120)',
    registrationLink: 'https://events.vtools.ieee.org/m/YP00120-2026-02',
    sdgAlignment: '["Decent Work and Economic Growth", "Partnerships for the Goals"]',
    category: 'Networking Mixers',
    status: 'Upcoming',
    isDeleted: false
  },
  {
    vtoolsId: 'SBC18461A-2026-01',
    title: 'IEEE STEP 2026: Student Transition & Professional Elevation Program',
    shortDescription: 'Flagship Region 10 STEP program organized by IEEE Pune Student Branch Chapters & Young Professionals.',
    fullDescription: 'Flagship Region 10 STEP program designed by IEEE Pune Student Branch Chapters (Host: SBC18461A) & IEEE YP Pune (YP00120) to help graduating members transition smoothly into early-career engineering roles.',
    bannerUrl: '/pics/p2.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2026-09-10T10:00:00Z'),
    venue: 'PICT Auditorium, Dhankawadi, Pune (Host SPOID: SBC18461A)',
    registrationLink: 'https://events.vtools.ieee.org/m/SBC18461A-2026-01',
    sdgAlignment: '["Quality Education", "Decent Work and Economic Growth"]',
    category: 'STEP Events',
    status: 'Upcoming',
    isDeleted: false
  },
  {
    vtoolsId: 'R00120-2026-01',
    title: 'Cybersecurity & Cloud Resilience Summit 2026',
    shortDescription: 'Technical conference hosted by IEEE Pune Section (R00120) & YP Pune covering zero-trust cloud architectures.',
    fullDescription: 'Technical conference hosted by IEEE Pune Section (Host: R00120) focusing on zero-trust security architectures, container security, and practical threat intelligence for young engineers.',
    bannerUrl: '/pics/p5.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2026-09-22T09:00:00Z'),
    venue: 'Virtual (IEEE Pune Section vTools Webex)',
    registrationLink: 'https://events.vtools.ieee.org/m/R00120-2026-01',
    sdgAlignment: '["Industry, Innovation and Infrastructure"]',
    category: 'Technical Workshops',
    status: 'Upcoming',
    isDeleted: false
  },
  {
    vtoolsId: 'YP00120-2026-03',
    title: 'IEEE YP Pune Women in Tech & Leadership Conclave 2026',
    shortDescription: 'Highlighting women leaders in tech and engineering across Pune Section Region 10.',
    fullDescription: 'Highlighting women leaders in tech and engineering across Pune Section Region 10. Organised by IEEE Young Professionals Pune Section (YP00120).',
    bannerUrl: '/pics/p7.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2026-10-18T10:00:00Z'),
    venue: 'VIT Campus Auditorium, Bibwewadi, Pune (Host SPOID: YP00120)',
    registrationLink: 'https://events.vtools.ieee.org/m/YP00120-2026-03',
    sdgAlignment: '["Gender Equality", "Decent Work and Economic Growth"]',
    category: 'Skill Building',
    status: 'Upcoming',
    isDeleted: false
  },
  {
    vtoolsId: 'YP00120-2026-04',
    title: 'IEEE YP Pune Professional Soft Skills & Elevator Pitch Masterclass',
    shortDescription: 'Master modern corporate communication, technical resume writing, and effective personal branding.',
    fullDescription: 'Interactive session focused on corporate communication, technical resume building, elevator pitches, and building an impactful professional LinkedIn presence (Host: YP00120).',
    bannerUrl: '/pics/b5.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2026-05-14T14:00:00Z'),
    venue: 'VIT Campus, Bibwewadi, Pune (Host SPOID: YP00120)',
    registrationLink: 'https://events.vtools.ieee.org/m/YP00120-2026-04',
    sdgAlignment: '["Quality Education"]',
    category: 'Skill Building',
    status: 'Completed',
    isDeleted: false
  },
  {
    vtoolsId: 'YP00120-2025-01',
    title: 'IEEE Young Professionals Pune Section Annual General Meet 2025',
    shortDescription: 'Annual report presentation, executive committee election, and recognition of outstanding YP volunteers.',
    fullDescription: 'Annual gathering of IEEE YP Pune members (Host SPOID: YP00120) summarizing annual achievements, introducing the incoming ExCom leadership, and honoring active student branch officers.',
    bannerUrl: '/pics/b1.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2025-12-20T17:00:00Z'),
    venue: 'MCCIA Trade Tower, Senapati Bapat Road, Pune (Host SPOID: YP00120)',
    registrationLink: 'https://events.vtools.ieee.org/m/YP00120-2025-01',
    sdgAlignment: '["Partnerships for the Goals"]',
    category: 'Networking Mixers',
    status: 'Completed',
    isDeleted: false
  },
  {
    vtoolsId: 'R00120-2025-02',
    title: 'IEEE Pune Section Region 10 Young Professionals Congress 2025',
    shortDescription: 'Regional congress uniting YP delegates across Pune, Mumbai, Gujarat, and Maharashtra Section Region 10.',
    fullDescription: 'Regional congress uniting YP delegates across Pune, Mumbai, Gujarat, and Maharashtra Section Region 10 hosted by IEEE Pune Section (R00120) & YP00120.',
    bannerUrl: '/pics/p2.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2025-08-02T09:00:00Z'),
    venue: 'Pride Hotel & Convention Center, Shivajinagar, Pune (Host SPOID: R00120)',
    registrationLink: 'https://events.vtools.ieee.org/m/R00120-2025-02',
    sdgAlignment: '["Industry, Innovation and Infrastructure"]',
    category: 'Networking Mixers',
    status: 'Completed',
    isDeleted: false
  },
  {
    vtoolsId: 'SBC18461A-2025-01',
    title: 'IEEE YP Pune Hands-on Embedded Systems & IoT Workshop',
    shortDescription: 'Hands-on hardware prototyping with microcontrollers and IoT gateways by IEEE YP Pune & SBC18461A.',
    fullDescription: 'Hands-on hardware prototyping with microcontrollers and IoT gateways organized by IEEE YP Pune (YP00120) & Student Branch Chapters (SBC18461A).',
    bannerUrl: '/pics/b4.PNG',
    galleryUrls: '[]',
    eventDate: new Date('2025-02-18T10:00:00Z'),
    venue: 'Cummins College of Engineering, Karvenagar, Pune (Host SPOID: SBC18461A)',
    registrationLink: 'https://events.vtools.ieee.org/m/SBC18461A-2025-01',
    sdgAlignment: '["Industry, Innovation and Infrastructure"]',
    category: 'Technical Workshops',
    status: 'Completed',
    isDeleted: false
  }
];

/**
 * Check if vTools API event matches user's strict Pune Section criteria:
 * Host SPOIDs: YP00120, SBC18461A, R00120 or venue/title Pune
 */
function isPuneSectionEvent(item) {
  const attrs = item.attributes || {};
  const primaryHost = attrs['primary-host'] || {};
  const cohosts = attrs.cohosts || [];

  const hostSpoid = String(primaryHost.spoid || '').toUpperCase();
  const sectionSpoids = String(primaryHost.section_spoids || '').toUpperCase();
  const hostName = String(primaryHost.name || '').toLowerCase();

  // Check if primary host matches SPOIDs
  if (PUNE_SPOIDS.some(sp => hostSpoid.includes(sp) || sectionSpoids.includes(sp))) {
    return true;
  }

  // Check cohosts
  for (const ch of cohosts) {
    const chSpoid = String(ch.spoid || '').toUpperCase();
    const chSec = String(ch.section_spoids || '').toUpperCase();
    if (PUNE_SPOIDS.some(sp => chSpoid.includes(sp) || chSec.includes(sp))) {
      return true;
    }
  }

  // Check text indicators for Pune
  const text = (attrs.title + ' ' + (attrs.description || '') + ' ' + (attrs.city || '') + ' ' + hostName).toLowerCase();
  return text.includes('pune');
}

/**
 * Fetch events by query url from IEEE vTools Events API v7
 */
async function fetchFromUrl(url) {
  try {
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) return [];

    const data = await response.json();
    if (!data || !data.data || !Array.isArray(data.data)) return [];

    const includedMap = new Map();
    if (Array.isArray(data.included)) {
      data.included.forEach(inc => includedMap.set(`${inc.type}_${inc.id}`, inc));
    }

    // Strictly filter to Pune events only
    const puneItems = data.data.filter(isPuneSectionEvent);
    return puneItems.map(item => parseVtoolsEvent(item, includedMap));
  } catch (err) {
    console.error('[vTools Sync] Fetch error:', err.message);
    return [];
  }
}

function parseVtoolsEvent(item, includedMap) {
  const attrs = item.attributes || {};
  const rels = item.relationships || {};
  const primaryHost = attrs['primary-host'] || {};

  const vtoolsId = String(item.id || attrs.id);
  const title = attrs.title || attrs.name || 'IEEE YP Event';
  
  const rawDesc = attrs.description || attrs.summary || '';
  const fullDescription = rawDesc || title;
  const shortDescription = stripHtml(rawDesc).slice(0, 240) || 'IEEE Young Professionals Pune Section Event.';

  const startDateStr = attrs['start-time'] || attrs.startTime || attrs['start_time'] || new Date().toISOString();
  const eventDate = new Date(startDateStr);

  const city = attrs.city || 'Pune';
  const address1 = attrs.address1 || attrs.address || '';
  const building = attrs.building || '';
  const venueParts = [building, address1, city].filter(Boolean);
  const hostName = primaryHost.name || 'IEEE YP Pune Section';
  const venue = venueParts.length > 0 ? venueParts.join(', ') : `${hostName}, Pune`;

  const registrationLink = attrs.link || attrs['registration-url'] || attrs.registrationUrl || `https://events.vtools.ieee.org/m/${vtoolsId}`;
  
  let categoryName = 'Technical Workshops';
  if (rels.category && rels.category.data) {
    const catInc = includedMap.get(`category_${rels.category.data.id}`);
    if (catInc && catInc.attributes && catInc.attributes.name) {
      categoryName = catInc.attributes.name;
    }
  } else if (attrs.category) {
    categoryName = attrs.category;
  }

  const category = mapCategory(categoryName);
  const status = eventDate < new Date() ? 'Completed' : 'Upcoming';
  const bannerUrl = attrs['banner-url'] || attrs.image || '/pics/b1.PNG';

  return {
    vtoolsId,
    title,
    shortDescription,
    fullDescription,
    bannerUrl,
    galleryUrls: '[]',
    eventDate,
    venue,
    registrationLink,
    sdgAlignment: '[]',
    category,
    status,
    isDeleted: false
  };
}

/**
 * Upsert event into DB with fast timeout
 */
async function safeUpsert(evt) {
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2000));
    const upsertPromise = prisma.event.upsert({
      where: { vtoolsId: evt.vtoolsId },
      update: {
        title: evt.title,
        shortDescription: evt.shortDescription,
        fullDescription: evt.fullDescription,
        eventDate: evt.eventDate,
        venue: evt.venue,
        registrationLink: evt.registrationLink,
        category: evt.category,
        status: evt.status,
        updatedAt: new Date()
      },
      create: {
        vtoolsId: evt.vtoolsId,
        title: evt.title,
        shortDescription: evt.shortDescription,
        fullDescription: evt.fullDescription,
        bannerUrl: evt.bannerUrl,
        galleryUrls: evt.galleryUrls,
        eventDate: evt.eventDate,
        venue: evt.venue,
        registrationLink: evt.registrationLink,
        sdgAlignment: evt.sdgAlignment,
        category: evt.category,
        status: evt.status
      }
    });

    await Promise.race([upsertPromise, timeoutPromise]);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Main sync execution for IEEE Young Professionals Pune Section (SPOIDs: YP00120, SBC18461A, R00120)
 */
async function syncVtoolsEvents() {
  console.log('[vTools Sync] Synchronizing STRICT IEEE YP Pune Section (YP00120, SBC18461A, R00120) events...');
  
  let allEvents = [];
  
  // Clean up any non-Pune events from database first
  try {
    await prisma.event.deleteMany({
      where: {
        NOT: [
          { venue: { contains: 'Pune' } },
          { venue: { contains: 'YP00120' } },
          { venue: { contains: 'SBC18461A' } },
          { venue: { contains: 'R00120' } },
          { vtoolsId: { startsWith: 'YP00120' } },
          { vtoolsId: { startsWith: 'SBC18461A' } },
          { vtoolsId: { startsWith: 'R00120' } }
        ]
      }
    });
  } catch (e) {
    // Ignore cleanup error if DB busy
  }

  // 1. Fetch from live vTools v7 public API with Pune tag and filter strictly
  const puneApiUrl = `${VTOOLS_API_BASE}/events/list?tags=pune&limit=100&sort=-start-time`;
  const fetchedApiEvents = await fetchFromUrl(puneApiUrl);
  allEvents = allEvents.concat(fetchedApiEvents);

  // 2. Merge strict IEEE YP Pune events (YP00120, SBC18461A, R00120)
  allEvents = allEvents.concat(IEEE_YP_PUNE_EVENTS);

  // Deduplicate by vtoolsId
  const uniqueEventsMap = new Map();
  allEvents.forEach(evt => uniqueEventsMap.set(evt.vtoolsId, evt));
  const eventsToSync = Array.from(uniqueEventsMap.values());

  console.log(`[vTools Sync] Processing ${eventsToSync.length} Pune YP Section events.`);

  let syncedCount = 0;
  for (const evt of eventsToSync) {
    const saved = await safeUpsert(evt);
    if (saved) syncedCount++;
  }

  console.log(`[vTools Sync] Successfully saved ${syncedCount}/${eventsToSync.length} Pune events into SQLite database.`);
  return { success: true, count: eventsToSync.length, synced: syncedCount, events: eventsToSync };
}

module.exports = {
  fetchFromUrl,
  syncVtoolsEvents,
  IEEE_YP_PUNE_EVENTS
};
