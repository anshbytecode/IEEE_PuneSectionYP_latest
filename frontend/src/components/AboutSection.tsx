import { motion } from 'framer-motion';
import { LineMaskSplit } from './Common/LineMaskSplit';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const highlights = [
  { value: '2016', label: 'Year Established' },
  { value: '500+', label: 'Active Members' },
  { value: '10',   label: 'Years of Excellence' },
  { value: '23+',  label: 'Activities in 2025' },
];

/**
 * AboutSection
 * Clean light theme with Gold border box design.
 */
const AboutSection = () => (
  <section
    className="py-16 px-4 bg-white w-full relative"
    aria-labelledby="about-heading"
  >
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* ── LEFT: Text column ───────────────────────────────────── */}
      <div>
        {/* Small badge label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 mb-3">
          <LineMaskSplit text="ABOUT US" duration={0.5} />
        </div>

        {/* Heading */}
        <h2
          id="about-heading"
          className="text-3xl lg:text-5xl font-extrabold text-ieee-blue mt-2 mb-6 leading-tight font-display tracking-tight"
        >
          <LineMaskSplit text="A Decade of Connecting Engineers" delay={0.1} />
        </h2>

        {/* Body paragraph 1 */}
        <div className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 font-sans">
          <LineMaskSplit
            text="The IEEE Pune Section Young Professionals Affinity Group (YP AG) is a dynamic community that connects students, early-career professionals, and experienced technologists to foster professional growth and collaboration. Established in 2016, the affinity group completes 10 years of continuous activity in 2026."
            delay={0.2}
            duration={0.6}
          />
        </div>

        {/* Body paragraph 2 */}
        <div className="text-gray-600 text-sm leading-relaxed mb-8 font-sans">
          <LineMaskSplit
            text="With 500+ members spanning industry, academia, and government, IEEE YP Pune serves as a bridge between education and profession — through technical workshops, career sessions, research initiatives, and industry collaborations."
            delay={0.3}
            duration={0.6}
          />
        </div>

        {/* CTAs */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="/activities"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-ieee-blue to-ieee-teal text-white hover:shadow-lg hover:scale-105 transition-all duration-250 cursor-pointer inline-flex items-center justify-center tracking-wide uppercase shadow-sm"
            aria-label="Explore IEEE YP Pune activities"
          >
            Our Activities
          </a>
          <a
            href="/contact"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-50/80 border border-amber-300 text-amber-800 hover:bg-amber-100 hover:scale-105 transition-all duration-250 cursor-pointer inline-flex items-center justify-center tracking-wide uppercase"
            aria-label="Join IEEE YP Pune"
          >
            Join IEEE YP
          </a>
        </motion.div>
      </div>

      {/* ── RIGHT: Stats highlight grid with Gold border boxes ── */}
      <div className="grid grid-cols-2 gap-6">
        {highlights.map((item, i) => (
          <motion.div
            key={item.label}
            className="bg-white rounded-2xl p-6 border border-amber-200/90 hover:border-amber-400 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group"
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {/* Gold Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

            <div className="text-3xl lg:text-4xl font-extrabold text-ieee-blue leading-none group-hover:text-amber-600 transition-colors duration-200 font-display">
              {item.value}
            </div>
            <div className="text-xs font-bold text-gray-500 mt-3 uppercase tracking-wider font-mono">{item.label}</div>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default AboutSection;
