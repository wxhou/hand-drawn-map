'use client';

import { Search, MapPin, ArrowRight, Star, Cake, Heart, Building2, GraduationCap, Home, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Featured locations data with enhanced visuals
const featuredLocations = [
  { name: '西湖', city: '杭州', image: 'https://images.unsplash.com/photo-1575585269294-7d28dd9028ae?w=400&h=300&fit=crop', gradient: 'from-blue-400/20 via-blue-500/10 to-cyan-400/20', visits: '12.5k' },
  { name: '故宫', city: '北京', image: 'https://images.unsplash.com/photo-1584450150050-4b9bdbd51f68?w=400&h=300&fit=crop', gradient: 'from-red-400/20 via-orange-500/10 to-amber-400/20', visits: '18.2k' },
  { name: '东方明珠', city: '上海', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&h=300&fit=crop', gradient: 'from-purple-400/20 via-pink-500/10 to-rose-400/20', visits: '15.8k' },
  { name: '黄山', city: '安徽', image: 'https://images.unsplash.com/photo-1545579133-99d589d5d282?w=400&h=300&fit=crop', gradient: 'from-green-400/20 via-emerald-500/10 to-teal-400/20', visits: '9.3k' },
];

// Enhanced occasion quick picks with SVG icons
const occasions = [
  { name: '生日', icon: Cake, color: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30', textColor: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200/50 dark:border-rose-800/30', hover: 'hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/50 dark:hover:to-pink-900/50' },
  { name: '纪念日', icon: Heart, color: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30', textColor: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200/50 dark:border-pink-800/30', hover: 'hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/50 dark:hover:to-rose-900/50' },
  { name: '婚礼', icon: Building2, color: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30', textColor: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200/50 dark:border-violet-800/30', hover: 'hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/50 dark:hover:to-purple-900/50' },
  { name: '毕业', icon: GraduationCap, color: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30', textColor: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200/50 dark:border-amber-800/30', hover: 'hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/50 dark:hover:to-yellow-900/50' },
  { name: '乔迁', icon: Home, color: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30', textColor: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200/50 dark:border-emerald-800/30', hover: 'hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50' },
  { name: '送别', icon: UserMinus, color: 'bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30', textColor: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200/50 dark:border-sky-800/30', hover: 'hover:from-sky-100 hover:to-blue-100 dark:hover:from-sky-900/50 dark:hover:to-blue-900/50' },
];

// Floating particles component
function FloatingParticles() {
  const shouldReduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    xOffset: number;
    hue: number;
  }>>([]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setParticles([]);
      return;
    }
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 30 + 25,
      delay: Math.random() * 10,
      xOffset: Math.random() * 40 - 20,
      hue: Math.random() * 60 + 220,
    })));
  }, [shouldReduceMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsl(${particle.hue}, 70%, 70%, 0.4) 0%, hsl(${particle.hue}, 60%, 60%, 0.1) 50%, transparent 100%)`,
          }}
          animate={shouldReduceMotion ? {} : {
            y: [0, -100, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={shouldReduceMotion ? { duration: 0 } : {
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Animated background shapes
function AnimatedShapes() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] max-w-[800px] max-h-[800px]"
        animate={shouldReduceMotion ? {} : {
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-fuchsia-400/15 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-400/10 via-transparent to-blue-400/10 rounded-full blur-[80px]" />
      </motion.div>

      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vw] max-w-[700px] max-h-[700px]"
        animate={shouldReduceMotion ? {} : {
          rotate: [0, -360],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-rose-400/15 via-pink-400/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/8 via-orange-400/8 to-transparent rounded-full blur-[80px]" />
      </motion.div>

      {/* Center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-light-primary/10 via-light-secondary/10 to-light-accent/10 rounded-full blur-[120px]" />
      </motion.div>
    </div>
  );
}

// Enhanced occasion card component
function OccasionCard({ occasion, isSelected, onClick, index }: {
  occasion: typeof occasions[0];
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = occasion.icon;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25 + index * 0.06, duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-medium
        border transition-all duration-300 ease-out backdrop-blur-sm
        ${isSelected
          ? 'bg-gradient-to-r from-light-primary to-light-secondary text-white shadow-lg shadow-light-primary/30 border-transparent'
          : `${occasion.color} ${occasion.textColor} ${occasion.border} ${occasion.hover} border hover:shadow-lg hover:shadow-light-primary/10`
        }
      `}
      aria-pressed={isSelected}
    >
      <span className="relative z-10 flex items-center gap-1">
        <Icon className="w-3 h-3" aria-hidden="true" />
        <span>{occasion.name}</span>
      </span>
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-light-primary/90 to-light-secondary/90"
          layoutId="selectedOccasion"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
    </motion.button>
  );
}

// Enhanced featured location card component
function LocationCard({ location, index, onLocationSelect }: {
  location: typeof featuredLocations[0];
  index: number;
  onLocationSelect: (location: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 + index * 0.08, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <motion.button
        onClick={() => {
          onLocationSelect(`${location.name} ${location.city}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full overflow-hidden rounded-2xl bg-light-surface/80 backdrop-blur-md border border-light-border/40 shadow-sm hover:shadow-2xl hover:shadow-light-primary/15 transition-all duration-500 text-left"
        aria-label={`选择 ${location.name} ${location.city}`}
      >
        {/* Premium gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${location.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out`} />

        {/* Glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image container */}
        <div className="relative h-24 overflow-hidden">
          <motion.img
            src={location.image}
            alt={`${location.name} 风景图片`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-light-surface/95 via-light-surface/30 to-transparent" />

          {/* Visit count badge */}
          <motion.div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-light-surface/90 backdrop-blur-md text-xs font-semibold text-light-text-secondary border border-light-border/30 shadow-lg"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
            <span>{location.visits}</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative p-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-light-text group-hover:text-light-primary transition-colors duration-300">
                {location.name}
              </h3>
              <p className="text-sm text-light-text-muted/80 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{location.city}</span>
              </p>
            </div>
            <motion.div
              animate={{ x: isHovered ? 0 : 8, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-light-primary to-light-secondary text-white flex items-center justify-center shadow-lg shadow-light-primary/40"
              aria-hidden="true"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

export function HeroSection() {
  const [location, setLocation] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), shouldReduceMotion ? 0 : 50);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  const handleGenerate = () => {
    if (location) {
      const params = new URLSearchParams();
      params.set('location', location);
      if (selectedOccasion) params.set('occasion', selectedOccasion);
      window.location.href = `/create?${params.toString()}`;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section className="relative h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-light-background via-light-surface/30 to-light-background" />

      {/* Animated shapes */}
      <AnimatedShapes />
      <FloatingParticles />

      <div className="container relative z-10 px-4 py-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Headline with premium gradient */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.1]"
          >
            <span className="text-light-text tracking-tight">
              把有意义的地方
            </span>
            <br />
            <span className="bg-gradient-to-r from-light-primary via-light-secondary to-light-accent bg-clip-text text-transparent inline-block">
              变成独特的礼物
            </span>
          </motion.h1>

          {/* Subheadline with glass effect */}
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-light-text-secondary/80 mb-4 max-w-xl mx-auto leading-relaxed"
          >
            用 AI 将任何地点转换为手绘风格艺术地图
          </motion.p>

          {/* Enhanced Search Input with glassmorphism */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-4">
            <div className="relative group">
              {/* Animated glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-light-primary via-light-secondary to-light-accent rounded-[20px] opacity-20 group-hover:opacity-35 transition-opacity duration-500 blur-sm"
                animate={isFocused ? { opacity: [0.2, 0.35, 0.2] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative flex items-center gap-2 p-2 bg-light-surface/70 backdrop-blur-2xl rounded-[18px] border border-light-border/40 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${isFocused ? 'text-light-primary scale-110' : 'text-light-text-muted'}`} aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="输入地点名称，如：杭州西湖、北京故宫..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full h-12 pl-12 pr-4 bg-transparent text-light-text placeholder:text-light-text-muted/60 focus:outline-none text-[15px] transition-all duration-300"
                    aria-label="输入地点名称"
                  />
                </div>
                <Button
                  onClick={handleGenerate}
                  size="lg"
                  disabled={!location}
                  className="h-11 px-8 bg-gradient-to-r from-light-primary to-light-secondary hover:from-light-primary/90 hover:to-light-secondary/90 shadow-xl shadow-light-primary/25 transition-all duration-300 min-w-[120px]"
                  aria-label="开始创作手绘地图"
                >
                  <span className="relative z-10 flex items-center gap-2 font-medium">
                    开始创作
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Occasion Quick Picks */}
          <motion.div variants={itemVariants} className="mb-4">
            <p className="text-xs text-light-text-muted/60 mb-2 font-medium">快速选择场合</p>
            <div className="flex justify-center gap-1.5 max-w-3xl mx-auto">
              {occasions.map((occasion, index) => (
                <OccasionCard
                  key={occasion.name}
                  occasion={occasion}
                  isSelected={selectedOccasion === occasion.name}
                  onClick={() => setSelectedOccasion(
                    selectedOccasion === occasion.name ? '' : occasion.name
                  )}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* Featured Locations */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-lg font-semibold text-light-text">热门目的地</span>
              <button className="text-sm font-medium text-light-primary/80 hover:text-light-primary transition-colors flex items-center gap-1.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-light-primary/50 rounded px-3 py-1.5 hover:bg-light-surface/50 rounded-full">
                <span>查看更多</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2" role="list" aria-label="热门目的地列表">
              {featuredLocations.map((loc, index) => (
                <LocationCard
                  key={loc.name}
                  location={loc}
                  index={index}
                  onLocationSelect={setLocation}
                />
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}