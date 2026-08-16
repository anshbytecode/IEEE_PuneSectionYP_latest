import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, Building2, MapPin, Clock, ChevronRight,
  ChevronLeft, ChevronDown, ArrowRight, Sparkles, UserPlus,
  X, Filter
} from 'lucide-react';

import { eventService, EventItem } from '../services/eventService';
import { mediaService } from '../services/mediaService';

import {
  activitiesPageStats,
  pastMoments,
} from '../data/homePageData';

/* â”€â”€ Icon map for dynamic stat icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ICON_MAP = { Calendar, Users, Building2 };

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* â”€â”€ Category pill colors â€” light-only â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Networking:         { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500'  },
  'Tech Talk':        { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'     },
  Workshop:           { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  'Industry Connect': { bg: 'bg-purple-100',  text: 'text-purple-700',  dot: 'bg-purple-500'  },
  Flagship:           { bg: 'bg-[#E8F4F8]',   text: 'text-[#004d75]',   dot: 'bg-[#006a64]'   },
  Leadership:         { bg: 'bg-rose-100',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
  Technical:          { bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-500'     },
};

interface ActivityCardProps {
  event: {
    id: string;
    category: string;
    status: string;
    day: string;
    month: string;
    year: string;
    title: string;
    subtitle: string;
    venue: string;
    time: string;
    imageUrl: string;
    imageAlt: string;
  };
  index: number;
  onClick: () => void;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ACTIVITY CARD (Standard Grid Card with Hover Lift)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ActivityCard = ({ event, index, onClick }: ActivityCardProps) => {
  const catStyle = CATEGORY_COLORS[event.category] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-500',
  };

  return (
    <motion.article
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer hover-lift flex flex-col justify-between"
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      aria-label={`Event: ${event.title}`}
    >
      <div>
        {/* Cover Image */}
        <div className="relative h-44 overflow-hidden bg-[#f0f3ff]">
          <img
            src={event.imageUrl}
            alt={event.imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Category Pill */}
          <span className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${catStyle.bg} ${catStyle.text}`}>
            {event.category}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            {/* Date Box */}
            <div className="flex flex-col items-center justify-center bg-[#E8F4F8] rounded-xl px-3 py-2 shrink-0 border border-[#004d75]/10 text-center">
              <span className="text-xl font-extrabold text-[#004d75] leading-none">{event.day}</span>
              <span className="text-[10px] font-bold text-[#004d75] uppercase tracking-wider mt-0.5">{event.month}</span>
              <span className="text-[9px] text-[#40484f]">{event.year}</span>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[#151c27] leading-snug line-clamp-2 group-hover:text-[#004d75] transition-colors">
                {event.title}
              </h3>
              <p className="text-xs text-[#40484f] mt-1 line-clamp-2 leading-relaxed">
                {event.subtitle}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-1.5 text-xs text-[#40484f]">
            <div className="flex items-center gap-2 truncate">
              <MapPin size={14} className="shrink-0 text-[#004d75]" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-[#004d75]" />
              <span>{event.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-end gap-1 text-xs font-bold text-[#004d75] group-hover:gap-2 transition-all">
          View Details <ChevronRight size={14} />
        </div>
      </div>
    </motion.article>
  );
};

interface MomentUIItem {
  id: string | number;
  label: string;
  imageUrl: string;
  imageAlt: string;
}

interface ActivityPageStat {
  id: string;
  icon: 'Calendar' | 'Users' | 'Building2';
  value: string | number;
  label: string;
}

const DEFAULT_IEEE_ACTIVITIES: EventItem[] = [
  {
    id: 'evt-codebhoomi-2026',
    title: 'IEEE CODEBhoomi 2026 Hackathon',
    shortDescription: 'A flagship technology initiative bringing young engineers and innovators together to build impactful solutions for real-world challenges.',
    fullDescription: 'IEEE CODEBhoomi 2026 Hackathon is a flagship initiative of IEEE Young Professionals Pune Section focused on innovation, collaboration and technology for humanity.',
    bannerUrl: '/pic_ieeeupload/CB.jpeg',
    galleryUrls: [],
    eventDate: '2026-03-28T09:00:00.000Z',
    venue: 'Pune',
    sdgAlignment: ['Quality Education', 'Industry & Innovation'],
    category: 'Flagship',
    status: 'Upcoming',
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  {
    id: 'evt-innovation-inclave-2026',
    title: 'Innovation Inclave',
    shortDescription: 'An innovation-focused gathering connecting engineers, professionals, innovators and technology enthusiasts.',
    fullDescription: 'Innovation Inclave brings together professionals and young innovators to exchange ideas, explore emerging technologies and create meaningful collaborations.',
    bannerUrl: '/pic_ieeeupload/IC.jpeg',
    galleryUrls: [],
    eventDate: '2026-04-18T09:30:00.000Z',
    venue: 'Pune',
    sdgAlignment: ['Industry & Innovation', 'Partnerships for the Goals'],
    category: 'Networking',
    status: 'Upcoming',
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  {
    id: 'evt-upskills-2026',
    title: 'Up Skills',
    shortDescription: 'A skill-development initiative designed to help young engineers strengthen their technical and professional capabilities.',
    fullDescription: 'Up Skills provides practical learning opportunities, technical knowledge and career-focused guidance for students and early-career professionals.',
    bannerUrl: '/pic_ieeeupload/s1.png',
    galleryUrls: [],
    eventDate: '2026-05-10T15:00:00.000Z',
    venue: 'Pune',
    sdgAlignment: ['Quality Education', 'Decent Work'],
    category: 'Workshop',
    status: 'Upcoming',
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  {
    id: 'evt-aerospace-2026',
    title: 'All About a Career in Aerospace',
    shortDescription: 'An expert-oriented session exploring career opportunities, skills and pathways in the aerospace industry.',
    fullDescription: 'All About a Career in Aerospace introduces students and young professionals to aerospace careers, industry opportunities and the skills required to build a successful career.',
    bannerUrl: '/pic_ieeeupload/p2.png',
    galleryUrls: [],
    eventDate: '2026-06-14T10:00:00.000Z',
    venue: 'Pune',
    sdgAlignment: ['Quality Education', 'Decent Work'],
    category: 'Technical',
    status: 'Upcoming',
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  {
    id: 'evt-innoverse-2026',
    title: 'Innoverse',
    shortDescription: 'An innovation and technology event showcasing ideas, projects and solutions developed by young innovators.',
    fullDescription: 'Innoverse creates a platform for students, young professionals and innovators to showcase technological ideas and explore new possibilities.',
    bannerUrl: '/pic_ieeeupload/innoverse.jpg',
    galleryUrls: [],
    eventDate: '2026-07-04T09:00:00.000Z',
    venue: 'Pune',
    sdgAlignment: ['Industry & Innovation'],
    category: 'Flagship',
    status: 'Upcoming',
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  {
    id: 'evt-hack-humanity-2026',
    title: 'Hack for Humanity',
    shortDescription: 'A collaborative hackathon encouraging participants to develop technology-driven solutions addressing societal challenges.',
    fullDescription: 'Hack for Humanity brings developers, designers and innovators together to build technology solutions that create positive social impact.',
    bannerUrl: '/pic_ieeeupload/hackh.jpg',
    galleryUrls: [],
    eventDate: '2026-08-08T09:00:00.000Z',
    venue: 'Pune',
    sdgAlignment: ['Reduced Inequalities', 'Industry & Innovation'],
    category: 'Hackathon',
    status: 'Upcoming',
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  {
    id: 'evt-tech-good-2026',
    title: 'Tech For Good Hackathon',
    shortDescription: 'A technology-focused hackathon where participants develop innovative solutions aimed at creating positive social and community impact.',
    fullDescription: 'Tech For Good Hackathon encourages young engineers and innovators to use technology to address real-world challenges and contribute towards a better society.',
    bannerUrl: '/pic_ieeeupload/techg.jpg',
    galleryUrls: [],
    eventDate: '2026-09-12T09:00:00.000Z',
    venue: 'Pune',
    sdgAlignment: ['Quality Education', 'Reduced Inequalities', 'Industry & Innovation'],
    category: 'Hackathon',
    status: 'Upcoming',
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

/* ── ACTIVITIES PAGE ─────────────────────────────────────────────────── */
const ActivitiesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dbEvents, setDbEvents] = useState<EventItem[]>([]);
  const [moments, setMoments] = useState<MomentUIItem[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sliding Window Protocol Buffer for Event Posters
  const [posterSlideIndex, setPosterSlideIndex] = useState(0);
  const activePosters = useMemo(() => [
    { id: 'p1', title: 'IEEE CODEBhoomi 2026 Hackathon', img: '/pic_ieeeupload/CB.jpeg', category: 'Flagship 2026' },
    { id: 'p2', title: 'Innovation Inclave', img: '/pic_ieeeupload/IC.jpeg', category: 'IC' },
    { id: 'p3', title: 'Up Skills', img: '/pic_ieeeupload/s1.png', category: 'Up Skills' },
    { id: 'p4', title: 'All about a carrer in aerospace', img: '/pic_ieeeupload/p2.png', category: 'Aerospace' },
    { id: 'p5', title: 'Innoverse', img: '/pic_ieeeupload/innoverse.jpg', category: 'Innoverse' },
    { id: 'p6', title: 'Hack for Humanity', img: '/pic_ieeeupload/hackh.jpg', category: 'Hack4Humanity' },
    { id: 'p7', title: 'Tech For Good Hackathon', img: '/pic_ieeeupload/techg.jpg', category: 'Diversity 2026' }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPosterSlideIndex(prev => (prev + 1) % activePosters.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activePosters.length]);

  // Fetch events and gallery on load
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const [eventsRes, mediaRes] = await Promise.all([
          eventService.getEvents().catch(() => ({ success: false, events: [] })),
          mediaService.getMedia({ file_type: 'image', limit: 5 }).catch(() => ({ success: false, media: [] }))
        ]);

        if (eventsRes && eventsRes.success && eventsRes.events && eventsRes.events.length > 0) {
          const backendEvents = eventsRes.events.filter(e => !e.isDeleted);
          const backendIds = new Set(backendEvents.map(e => e.id));
          const merged = [...backendEvents, ...DEFAULT_IEEE_ACTIVITIES.filter(e => !backendIds.has(e.id))];
          setDbEvents(merged);
        } else {
          setDbEvents(DEFAULT_IEEE_ACTIVITIES);
        }

        if (mediaRes && mediaRes.success && mediaRes.media && mediaRes.media.length > 0) {
          setMoments(mediaRes.media.map(m => ({
            id: m.id,
            label: m.event_title || m.fileName.split('.')[0],
            imageUrl: m.fileUrl,
            imageAlt: m.fileName
          })));
        } else {
          setMoments(pastMoments as MomentUIItem[]);
        }
      } catch (err) {
        console.error('Failed to load activities page data:', err);
        setDbEvents(DEFAULT_IEEE_ACTIVITIES);
        setMoments(pastMoments as MomentUIItem[]);
      } finally {
        setLoading(false);
      }
    };
    loadPageData();
  }, []);

  // Format events to standard UI structure
  const activitiesList = useMemo(() => {
    return dbEvents.map(event => {
      const dateObj = new Date(event.eventDate);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = String(dateObj.getFullYear());

      let formattedTime = 'All Day';
      if (event.eventDate.includes('T')) {
        const timePart = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (timePart !== '12:00 AM') {
          formattedTime = timePart;
        }
      }

      return {
        id: event.id,
        rawDate: dateObj,
        category: event.category || 'Technical',
        status: event.status === 'Upcoming' ? 'upcoming' : 'past',
        day,
        month,
        year,
        title: event.title,
        subtitle: event.shortDescription,
        venue: event.venue,
        time: formattedTime,
        imageUrl: event.bannerUrl || '/pics/b1.PNG',
        imageAlt: `${event.title} cover`,
      };
    });
  }, [dbEvents]);

  // Compute categories with counts dynamically
  const activitiesCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    activitiesList.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });

    const sidebarCategories = [
      { id: 'cat-all', label: 'All Activities', count: activitiesList.length, color: 'bg-[#004d75]' },
    ];

    Object.keys(counts).forEach((cat, index) => {
      const style = CATEGORY_COLORS[cat] || { dot: 'bg-gray-500' };
      sidebarCategories.push({
        id: `cat-${index}`,
        label: cat,
        count: counts[cat],
        color: style.dot
      });
    });

    return sidebarCategories;
  }, [activitiesList]);

  // Calendar Day Computation
  const calendarGridDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday-based indexing: 0 = Mon, ..., 6 = Sun
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      hasEvent: boolean;
      eventCount: number;
    }> = [];

    const today = new Date();
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    // Previous month padding days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        hasEvent: false,
        eventCount: 0
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      const matchingEvents = activitiesList.filter(e => isSameDay(e.rawDate, d));
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: isSameDay(d, today),
        hasEvent: matchingEvents.length > 0,
        eventCount: matchingEvents.length
      });
    }

    // Next month padding days to fill grid
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        hasEvent: false,
        eventCount: 0
      });
    }

    return days;
  }, [currentCalendarDate, activitiesList]);

  // Featured activity determination
  const featured = useMemo(() => {
    let feat = null;
    if (activeTab === 'upcoming') {
      feat = activitiesList.find(e => e.status === 'upcoming' && e.category.toLowerCase() === 'flagship');
      if (!feat) feat = activitiesList.find(e => e.status === 'upcoming');
    } else {
      feat = activitiesList.find(e => e.status === 'past' && e.category.toLowerCase() === 'flagship');
      if (!feat) feat = activitiesList.find(e => e.status === 'past');
    }

    if (feat) {
      return {
        id: feat.id,
        badge: feat.status === 'upcoming' ? 'UPCOMING FEATURED' : 'HIGHLIGHTED EVENT',
        category: feat.category.toUpperCase(),
        day: feat.day,
        month: feat.month,
        year: feat.year,
        title: feat.title,
        description: feat.subtitle,
        venue: feat.venue,
        time: feat.time,
        ctaText: feat.status === 'upcoming' ? 'Register Now' : 'View Details',
        ctaHref: `/public-events/${feat.id}`,
        imageUrl: feat.imageUrl,
        imageAlt: feat.imageAlt,
      };
    }
    return null;
  }, [activitiesList, activeTab]);

  // Filtered & sorted events list
  const filteredEvents = useMemo(() => {
    let list = activitiesList;

    // When a date is selected from the calendar, include all events on that date regardless of status tab
    if (selectedDate) {
      list = list.filter((e) =>
        e.rawDate.getDate() === selectedDate.getDate() &&
        e.rawDate.getMonth() === selectedDate.getMonth() &&
        e.rawDate.getFullYear() === selectedDate.getFullYear()
      );
    } else {
      list = list.filter((e) => e.status === activeTab);
    }

    if (selectedCategory !== 'All') {
      list = list.filter((e) => e.category === selectedCategory);
    }

    list.sort((a, b) => {
      const timeA = a.rawDate.getTime();
      const timeB = b.rawDate.getTime();
      return activeTab === 'upcoming' ? timeA - timeB : timeB - timeA;
    });

    return list;
  }, [activitiesList, activeTab, selectedCategory, selectedDate]);

  // Mini timeline cards (upcoming events this month)
  const upcomingTimelineCards = useMemo(() => {
    return activitiesList
      .filter(e => e.status === 'upcoming')
      .slice(0, 2);
  }, [activitiesList]);

  // Unique categories list for dropdown selector
  const categoryOptions = useMemo(() => {
    return ['All', ...new Set(activitiesList.map((e) => e.category))];
  }, [activitiesList]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="flex-grow flex flex-col font-sans bg-[#F9FAFB] text-[#151c27] min-h-screen">
      <main id="main-content" tabIndex={-1} className="flex-grow">

        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            1. HERO HEADER â€” dot-pattern bg, title + stat chips
            â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0] pt-12 pb-16">
          {/* Dot-pattern overlay right-third */}
          <div
            className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              {/* Left: heading */}
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-[#004d75] mb-4 leading-tight">
                  Events &amp; Activities
                </h1>
                <p className="text-[18px] text-[#40484f] leading-relaxed">
                  Discover opportunities to learn, connect and grow with fellow young professionals
                  across Pune and beyond. Join our technical workshops, networking meetups, and
                  leadership summits.
                </p>
              </div>

              {/* Right: quick stat chips */}
              <div className="grid grid-cols-3 gap-6 shrink-0">
                {(activitiesPageStats as ActivityPageStat[]).map(stat => {
                  const Icon = ICON_MAP[stat.icon] || Calendar;
                  return (
                    <div key={stat.id} className="flex items-center space-x-3 group">
                      <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center text-[#004d75] transition-transform group-hover:scale-110">
                        <Icon size={22} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-[20px] font-bold text-[#004d75] leading-none">{stat.value}</div>
                        <div className="text-[11px] text-[#40484f] uppercase tracking-wider font-semibold mt-0.5">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            2. MAIN SECTION â€” sidebar + content
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* â”€â”€ LEFT SIDEBAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <aside className="w-full lg:w-80 shrink-0 space-y-5 order-2 lg:order-1">

              {/* A. COMPACT MONTHLY CALENDAR */}
              <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-4 bg-[#004d75] text-white flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={15} />
                    {currentCalendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex space-x-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-white/20 rounded transition-colors" title="Previous Month">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-white/20 rounded transition-colors" title="Next Month">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                      <span key={d} className="text-[10px] font-bold text-[#707880] uppercase">{d}</span>
                    ))}
                  </div>

                  {/* Date grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {calendarGridDays.map((cell, idx) => {
                      const isSelected =
                        selectedDate &&
                        cell.date.getDate() === selectedDate.getDate() &&
                        cell.date.getMonth() === selectedDate.getMonth() &&
                        cell.date.getFullYear() === selectedDate.getFullYear();

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(isSelected ? null : cell.date)}
                          className={[
                            'py-2 text-xs rounded-lg relative transition-all flex flex-col items-center justify-center cursor-pointer',
                            !cell.isCurrentMonth
                              ? 'text-[#c0c7d0]'
                              : isSelected
                              ? 'bg-[#004d75] text-white font-bold shadow-md'
                              : cell.isToday
                              ? 'border border-[#004d75] font-bold text-[#004d75]'
                              : 'text-[#151c27] hover:bg-[#E8F4F8]',
                          ].join(' ')}
                        >
                          <span>{cell.dayNumber}</span>
                          {cell.hasEvent && (
                            <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-[#006a64]'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="mt-3 w-full py-1.5 text-xs text-[#004d75] font-semibold flex items-center justify-center gap-1 hover:underline"
                    >
                      <X size={13} /> Clear date ({selectedDate.toLocaleDateString()})
                    </button>
                  )}
                </div>
              </section>

              {/* B. EXPLORE CATEGORIES */}
              <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                <h3 className="font-bold text-[20px] text-[#004d75] mb-5 flex items-center gap-2">
                  <Filter size={17} /> Explore Categories
                </h3>
                <ul className="space-y-2">
                  {activitiesCategories.map(cat => {
                    const isActive =
                      (selectedCategory === 'All' && cat.label === 'All Activities') ||
                      selectedCategory === cat.label;
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={() => setSelectedCategory(cat.label === 'All Activities' ? 'All' : cat.label)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all ${
                            isActive ? 'bg-[#E8F4F8] text-[#004d75]' : 'text-[#40484f] hover:bg-[#f0f3ff]'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                            <span>{cat.label}</span>
                          </div>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-[#004d75] text-white' : 'bg-[#e2e8f8] text-[#40484f]'
                          }`}>
                            {cat.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* C. CTA */}
              <section className="bg-[#004d75] rounded-xl p-6 text-white relative overflow-hidden group shadow-md">
                <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:rotate-12 transition-transform duration-500">
                  <UserPlus size={120} />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                    <Users size={20} />
                  </div>
                  <h4 className="font-bold text-base mb-1.5">Want to host an event?</h4>
                  <p className="text-xs text-white/80 mb-5 leading-relaxed">
                    Collaborate with like-minded professionals to organize impactful technical sessions.
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full py-2.5 bg-[#006a64] text-white font-bold rounded-lg text-sm btn-glow flex items-center justify-center gap-2 hover:bg-[#005650] transition-all active:scale-95"
                  >
                    Get Started <ArrowRight size={14} />
                  </button>
                </div>
              </section>

              {/* D. STAY UPDATED */}
              <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#006a64]" />
                  <h3 className="text-sm font-bold text-[#004d75]">Stay Updated</h3>
                </div>
                <p className="text-xs text-[#40484f] leading-relaxed mb-3">
                  Subscribe to our channel to get instant updates about workshops, guest talks and meetups.
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-xs font-bold text-[#004d75] hover:underline flex items-center gap-1"
                >
                  Get Involved <ArrowRight size={12} />
                </button>
              </section>

            </aside>

            {/* â”€â”€ RIGHT MAIN CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="flex-1 space-y-6 order-1 lg:order-2">

              {/* VIEW SWITCHER + CATEGORY FILTER */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                {/* Segmented control */}
                <div className="inline-flex p-1 bg-[#e2e8f8] rounded-xl border border-[#c0c7d0]">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'upcoming' ? 'bg-[#004d75] text-white shadow-md' : 'text-[#40484f] hover:text-[#004d75]'
                    }`}
                    aria-pressed={activeTab === 'upcoming'}
                  >
                    Upcoming Events
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'past' ? 'bg-[#004d75] text-white shadow-md' : 'text-[#40484f] hover:text-[#004d75]'
                    }`}
                    aria-pressed={activeTab === 'past'}
                  >
                    Past Activities
                  </button>
                </div>

                {/* Date badge + dropdown */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  {selectedDate && (
                    <span className="text-xs bg-[#E8F4F8] text-[#004d75] px-3 py-1.5 rounded-lg border border-[#004d75]/20 font-semibold flex items-center gap-1.5">
                      <Calendar size={12} />
                      {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <button onClick={() => setSelectedDate(null)} className="hover:opacity-75"><X size={12} /></button>
                    </span>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(o => !o)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#c0c7d0] text-xs text-[#40484f] bg-white hover:bg-[#f0f3ff] transition-colors font-semibold min-w-[180px] justify-between"
                      aria-haspopup="listbox"
                      aria-expanded={dropdownOpen}
                      aria-label="Filter events by category"
                    >
                      <span>{selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {dropdownOpen && (
                      <ul
                        role="listbox"
                        className="absolute right-0 top-full mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-30 py-1 max-h-60 overflow-y-auto"
                      >
                        {categoryOptions.map(cat => (
                          <li key={cat}>
                            <button
                              role="option"
                              aria-selected={selectedCategory === cat}
                              onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                selectedCategory === cat ? 'text-[#004d75] font-bold bg-[#E8F4F8]' : 'text-[#40484f] hover:bg-[#f0f3ff]'
                              }`}
                            >
                              {cat === 'All' ? 'All Categories' : cat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* SLIDING WINDOW PROTOCOL POSTER CAROUSEL BUFFER */}
              {!selectedDate && (
                <div className="mb-8 bg-gradient-to-r from-[#00385e] via-[#004d75] to-[#006a64] rounded-2xl p-6 text-white shadow-lg border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-400 animate-spin" />
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-300">
                        2026 Active Event Posters
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-white/80">
                      <span>Window Buffer {posterSlideIndex + 1} of {activePosters.length}</span>
                    </div>
                  </div>

                  <div className="relative h-64 md:h-72 rounded-xl overflow-hidden bg-black/30 border border-white/15 flex items-center justify-center">
                    {activePosters.map((poster, pIdx) => (
                      <div
                        key={poster.id}
                        className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-6 transition-all duration-700 ${
                          pIdx === posterSlideIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        <div className="flex-1 text-left pr-4">
                          <span className="text-[11px] font-bold bg-amber-400 text-gray-900 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                            {poster.category}
                          </span>
                          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2 font-display">
                            {poster.title}
                          </h2>
                          <p className="text-white/80 text-xs md:text-sm max-w-lg leading-relaxed">
                            Continuous 2026 initiative planned by IEEE Young Professionals Pune Section across local technology hubs and campuses.
                          </p>
                        </div>
                        <div className="w-full md:w-64 h-48 md:h-56 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl shrink-0 mt-4 md:mt-0 bg-white/5">
                          <img src={poster.img} alt={poster.title} className="w-full h-full object-contain md:object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Indicator Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {activePosters.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setPosterSlideIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          dotIdx === posterSlideIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Jump to poster slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* FEATURED EVENT */}
              {!selectedDate && featured && (
                <>
                  <div className="flex items-center space-x-4 mb-1">
                    <h2 className="text-[28px] font-bold text-[#004d75]">
                      {featured.month} {featured.day}, {featured.year}
                    </h2>
                    <span className="text-xs font-bold bg-[#006a64]/10 text-[#006a64] px-3 py-1 rounded-full uppercase tracking-widest">
                      Today's Featured
                    </span>
                  </div>

                  <motion.div
                    className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden hover-lift flex flex-col md:flex-row group"
                    initial={reduced ? {} : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-full md:w-72 h-64 md:h-auto relative bg-[#f0f3ff] shrink-0">
                      <img
                        src={featured.imageUrl}
                        alt={featured.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-[#E2E8F0] flex items-center space-x-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-[#004d75] uppercase">{featured.badge}</span>
                      </div>
                    </div>

                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex space-x-2">
                            <span className="px-3 py-1 bg-[#E8F4F8] text-[#004d75] rounded-full text-[11px] font-bold uppercase">
                              {featured.category}
                            </span>
                          </div>
                          <span className="text-xs text-[#40484f] font-medium flex items-center gap-1">
                            <Clock size={12} /> {featured.time}
                          </span>
                        </div>
                        <h3 className="text-[24px] font-bold text-[#004d75] mb-3 group-hover:text-[#006a64] transition-colors leading-snug">
                          {featured.title}
                        </h3>
                        <p className="text-[15px] text-[#40484f] line-clamp-3 leading-relaxed mb-6">
                          {featured.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[#E2E8F0] pt-6">
                        <div className="flex items-center space-x-6 text-[#40484f]">
                          <div className="flex items-center">
                            <MapPin size={15} className="mr-2 text-[#004d75]" />
                            <span className="text-sm font-medium">{featured.venue}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(featured.ctaHref)}
                          className="px-8 py-3 bg-[#004d75] text-white font-bold rounded-lg btn-glow flex items-center gap-2 hover:bg-[#003d5e] transition-all text-sm"
                        >
                          {featured.ctaText} <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* UPCOMING HIGHLIGHTS */}
              {activeTab === 'upcoming' && !selectedDate && upcomingTimelineCards.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-bold text-[#707880] uppercase tracking-[0.2em]">
                    Upcoming this month
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingTimelineCards.map(card => (
                      <div
                        key={card.id}
                        onClick={() => navigate(`/public-events/${card.id}`)}
                        className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover-lift flex items-center space-x-5 cursor-pointer group"
                      >
                        <div className="w-16 h-16 shrink-0 bg-[#E8F4F8] border border-[#004d75]/20 rounded-xl flex flex-col items-center justify-center text-[#006a64]">
                          <span className="text-[10px] font-bold uppercase">{card.month}</span>
                          <span className="text-[22px] font-bold leading-none">{card.day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#151c27] truncate group-hover:text-[#004d75] transition-colors">
                            {card.title}
                          </h4>
                          <p className="text-xs text-[#40484f] truncate mt-0.5">
                            {card.venue} Â· {card.time}
                          </p>
                        </div>
                        <button className="px-4 py-1.5 border-2 border-[#004d75] text-[#004d75] font-bold rounded-lg hover:bg-[#004d75] hover:text-white transition-all text-xs shrink-0">
                          Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MAIN EVENTS GRID */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#151c27]">
                    {selectedDate
                      ? `Activities on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : (activeTab === 'upcoming' ? 'All Upcoming Events' : 'Past Activities Record')}
                  </h2>
                  <span className="text-xs text-[#707880]">
                    Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="spinner spinner-lg" />
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredEvents.map((event, i) => (
                      <ActivityCard
                        key={event.id}
                        event={event}
                        index={i}
                        onClick={() => navigate(`/public-events/${event.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#f0f3ff] rounded-2xl border-2 border-dashed border-[#c0c7d0] p-16 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#707880] mb-6 shadow-sm">
                      <Calendar size={36} />
                    </div>
                    <h5 className="text-xl font-bold text-[#40484f] mb-2">No events found for this filter</h5>
                    <p className="text-sm text-[#707880] mb-8 max-w-sm leading-relaxed">
                      Try selecting a different category or adjusting the date range from the calendar.
                    </p>
                    <button
                      onClick={() => { setSelectedCategory('All'); setSelectedDate(null); }}
                      className="text-[#004d75] font-bold flex items-center gap-1 hover:underline text-sm"
                    >
                      Clear all filters <X size={14} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            3. MOMENTS FROM PAST ACTIVITIES
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="bg-white py-12 border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#004d75]">Moments from Past Activities</h2>
                <p className="text-xs text-[#707880] mt-1">
                  Highlights and memories from our recent workshops and gatherings.
                </p>
              </div>
              <button
                onClick={() => navigate('/public-gallery')}
                className="text-xs font-bold text-[#004d75] hover:underline flex items-center gap-1"
              >
                <span>View all photos</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {moments.map((moment, i) => (
                <motion.div
                  key={moment.id}
                  className="group cursor-pointer"
                  onClick={() => navigate('/public-gallery')}
                  initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
                  whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#f0f3ff] border border-[#E2E8F0] shadow-sm">
                    <img
                      src={moment.imageUrl}
                      alt={moment.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#004d75]/0 group-hover:bg-[#004d75]/40 transition-colors duration-300 flex items-center justify-center">
                      <Sparkles size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#40484f] mt-2 text-center truncate group-hover:text-[#004d75] transition-colors">
                    {moment.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ActivitiesPage;
