import React, { useState, useEffect } from 'react';
import { teamService, TeamMemberItem } from '../services/teamService';
import { motion } from 'framer-motion';
import { Mail, Briefcase, Award, Users } from 'lucide-react';

const LinkedinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PublicAbout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await teamService.getTeam();
        if (res.success && res.teamMembers) {
          // Sort members by orderIndex ascending
          const sorted = res.teamMembers.sort((a, b) => a.orderIndex - b.orderIndex);
          setTeamMembers(sorted);
        }
      } catch (err) {
        console.error('Failed to load team members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="relative bg-gray-50 text-gray-800 pb-20 min-h-screen">
      {/* ────────────────────────────────────────────────────────────
          1. HERO HEADER
          ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="about-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#006699" fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-dots)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ieee-light text-ieee-blue text-xs font-bold uppercase tracking-wider mb-4">
            <Users size={12} />
            About Us
          </div>
          <h1 className="text-4xl font-bold text-ieee-dark leading-tight tracking-tight">
            Meet the{' '}
            <span className="bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent">
              IEEE Pune YP Committee
            </span>
          </h1>
          <p className="text-gray-500 text-[15px] mt-4 max-w-2xl mx-auto leading-relaxed">
            Learn about our core focus, the values we stand for, and the committee members driving these initiatives in the Pune Section.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. MISSION & VALUES
          ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-bold text-ieee-blue mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
              IEEE Pune Section Young Professionals Affinity Group is dedicated to the professional development and networking of IEEE members who have graduated within the last decade.
            </p>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
              We facilitate collaborative projects, educational forums, and industrial seminars. Our primary focus areas are:
            </p>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5 text-[15px] text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-ieee-teal mt-2.5 shrink-0" />
                <span><strong>Professional Mentoring:</strong> Bridging the gap between corporate leaders and early career graduates.</span>
              </li>
              <li className="flex items-start gap-2.5 text-[15px] text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-ieee-teal mt-2.5 shrink-0" />
                <span><strong>Continuous Learning:</strong> High-impact technical events on modern technology concepts.</span>
              </li>
              <li className="flex items-start gap-2.5 text-[15px] text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-ieee-teal mt-2.5 shrink-0" />
                <span><strong>Networking Ecosystem:</strong> Building cross-border networks with global tech practitioners.</span>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">Industry Impact</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Connecting local chapters directly to core technology platforms and firms.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">Empowered Careers</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Leveraging resources to support career advancement and technical mastery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. ACTIVE LEADERS
          ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="text-center mb-10">
          <span className="text-ieee-teal font-semibold text-xs uppercase tracking-wider block mb-2">Active Leaders</span>
        </div>

        {/* Static Uploaded Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          {[
  { id: 's1', name: 'Harshal Pathak', position: 'Team Member', img: '/drive-download/member1.jpg' },
  { id: 's2', name: 'Dhiraj Chaurasia', position: 'Team Member', img: '/drive-download/member2.jpg' },
  { id: 's3', name: 'Shrushti Vyawhare', position: 'Team Member', img: '/drive-download/member3.jpeg' },
  { id: 's4', name: 'Shruti Bhandurge', position: 'Team Member', img: '/drive-download/member4.jpeg' },
  { id: 's5', name: 'Deepa Mishra', position: 'Team Member', img: '/drive-download/member5.jpg' },
  { id: 's6', name: 'Rakshit', position: 'Team Member', img: '/drive-download/member6.jpg' },
].map((member, idx) => (
            <motion.div
              key={member.id}
              className="bg-white rounded-xl border border-gray-100 p-6 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-200 group"
              initial={reduced ? {} : { opacity: 0, y: 15 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-ieee-blue mb-4 shrink-0">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-[15px] group-hover:text-ieee-blue transition-colors">
                {member.name}
              </h3>
              <span className="text-ieee-teal text-xs font-semibold uppercase tracking-wider block mt-1">
                {member.position}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
