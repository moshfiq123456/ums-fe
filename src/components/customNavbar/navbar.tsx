'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Menu,
  Search,
  Bell,
  Settings,
  User,
  HelpCircle,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  X,
  Shield,
  CreditCard,
  Activity,
  Bookmark,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/lib/authSlice';
import { useLogoutMutation } from '@/lib/api';
import { useTheme } from '@/lib/theme-system';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Navbar: FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const { colorMode, setColorMode, resolvedMode } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedMode === 'dark';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.warn('Logout failed but clearing client state anyway');
    } finally {
      dispatch(logoutAction());
      router.push('/login');
    }
  };

  const toggleColorMode = () => {
    setColorMode(isDark ? 'light' : 'dark');
  };

  // ── Animations ──────────────────────────────────────────────

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
  };

  const dropdownItemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  };

  const searchVariants: Variants = {
    blur: { width: '200px', transition: { duration: 0.3, ease: 'easeInOut' } },
    focus: { width: '320px', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const notificationBadgeVariants: Variants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: 'spring', stiffness: 500, damping: 15 } },
  };

  const drawerVariants: Variants = {
    hidden: { x: '100%', transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
    visible: { x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  };

  const drawerOverlayVariants: Variants = {
    hidden: { opacity: 0, transition: { duration: 0.25 } },
    visible: { opacity: 1, transition: { duration: 0.25 } },
  };

  const drawerItemVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.15 + i * 0.06, duration: 0.3, ease: 'easeOut' },
    }),
  };

  // ── Data ────────────────────────────────────────────────────

  const notifications = [
    { id: 1, text: 'New message from John', time: '5m ago', unread: true },
    { id: 2, text: 'Your report is ready', time: '1h ago', unread: true },
    { id: 3, text: 'Meeting reminder', time: '2h ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const profileMenuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'View Profile', href: '/profile', description: 'Manage your details' },
        { icon: Shield, label: 'Security', href: '/settings/security', description: 'Password & 2FA' },
        { icon: CreditCard, label: 'Billing', href: '/settings/billing', description: 'Plans & payments' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Settings, label: 'Settings', href: '/settings', description: 'App configuration' },
        { icon: Activity, label: 'Activity Log', href: '/activity', description: 'Recent actions' },
        { icon: Bookmark, label: 'Saved Items', href: '/saved', description: 'Bookmarks & drafts' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Docs', href: '/help', description: 'Guides & FAQ' },
      ],
    },
  ];

  const handleProfileNavigation = (href: string) => {
    router.push(href);
    setProfileOpen(false);
    setMobileDrawerOpen(false);
  };

  const handleProfileClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileDrawerOpen(true);
      setNotificationsOpen(false);
    } else {
      setProfileOpen(!profileOpen);
      setNotificationsOpen(false);
    }
  };

  // ── Profile Avatar ──────────────────────────────────────────

  const ProfileAvatar = ({
    size = 'sm',
    showStatus = true,
  }: {
    size?: 'sm' | 'md' | 'lg';
    showStatus?: boolean;
  }) => {
    const wrapperSizeMap = { sm: 'w-9 h-9', md: 'w-14 h-14', lg: 'w-20 h-20' };
    const ringMap = { sm: 'ring-2', md: 'ring-[3px]', lg: 'ring-4' };
    const dotSizeMap = { sm: 'w-2.5 h-2.5', md: 'w-3.5 h-3.5', lg: 'w-4 h-4' };
    const dotRingMap = { sm: 'ring-[2px]', md: 'ring-[2.5px]', lg: 'ring-[3px]' };
    const dotPositionMap = {
      sm: '-bottom-[1px] -right-[1px]',
      md: '-bottom-[2px] -right-[2px]',
      lg: '-bottom-[2px] -right-[2px]',
    };

    return (
      <div className={`relative ${wrapperSizeMap[size]} flex-shrink-0`}>
        <div
          className={`${wrapperSizeMap[size]} rounded-full overflow-hidden ${ringMap[size]} ring-border/60 shadow-md`}
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="Profile"
            className="w-full h-full object-cover bg-muted"
          />
        </div>
        {showStatus && (
          <span
            className={`absolute ${dotPositionMap[size]} ${dotSizeMap[size]} rounded-full bg-emerald-500 ${dotRingMap[size]} ring-card block z-[1]`}
          />
        )}
      </div>
    );
  };

  // ── Desktop Profile Dropdown ────────────────────────────────

  const DesktopProfileDropdown = () => (
    <AnimatePresence>
      {profileOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute right-0 mt-3 w-[340px] bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
        >
          {/* Profile Header — uses semantic gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-accent" />
            <div className="relative px-5 pt-6 pb-5">
              <div className="flex items-start gap-4">
                <ProfileAvatar size="md" />
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="font-semibold text-foreground text-base truncate">John Doe</h4>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">john.doe@example.com</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/15 text-primary border border-primary/25">
                      Pro Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 border-b border-border">
            {[
              { label: 'Projects', value: '12' },
              { label: 'Tasks', value: '48' },
              { label: 'Teams', value: '3' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`px-4 py-3 text-center ${i < 2 ? 'border-r border-border' : ''}`}
              >
                <p className="text-base font-semibold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Menu Sections */}
          <div className="py-1.5 max-h-[320px] overflow-y-auto">
            {profileMenuSections.map((section, sIdx) => (
              <div key={section.title}>
                {sIdx > 0 && <div className="mx-4 my-1.5 border-t border-border" />}
                <p className="px-5 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {section.title}
                </p>
                {section.items.map((item, i) => (
                  <motion.button
                    key={item.label}
                    custom={sIdx * 3 + i}
                    variants={dropdownItemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleProfileNavigation(item.href)}
                    className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-accent transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0">
                      <item.icon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground/70 block mt-0.5 truncate">
                        {item.description}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/70 flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                  </motion.button>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/50 px-4 py-3 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-destructive/10 transition-all group"
            >
              <LogOut className="w-4 h-4 text-destructive group-hover:text-destructive transition-colors" />
              <span className="text-sm font-medium text-destructive group-hover:text-destructive">Sign out</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleColorMode}
              className="p-2 hover:bg-accent rounded-xl transition-all duration-200"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              <motion.div animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isDark ? (
                  <Sun className="w-4 h-4 text-foreground/70" />
                ) : (
                  <Moon className="w-4 h-4 text-foreground/60" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Mobile Profile Side Drawer ──────────────────────────────

  const MobileProfileDrawer = () => (
    <AnimatePresence>
      {mobileDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={drawerOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 right-0 bottom-0 z-[70] w-[85vw] max-w-[360px] bg-card shadow-lg flex flex-col border-l border-border"
          >
            {/* Header — semantic gradient */}
            <div className="relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-accent" />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </motion.button>

              <div className="relative px-6 pt-10 pb-6 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
                >
                  <ProfileAvatar size="lg" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="mt-4 text-lg font-bold text-foreground"
                >
                  John Doe
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="text-sm text-muted-foreground mt-1"
                >
                  john.doe@example.com
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="mt-3"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/25">
                    Pro Plan
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 border-b border-border flex-shrink-0">
              {[
                { label: 'Projects', value: '12' },
                { label: 'Tasks', value: '48' },
                { label: 'Teams', value: '3' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={drawerItemVariants}
                  initial="hidden"
                  animate="visible"
                  className={`px-4 py-4 text-center ${i < 2 ? 'border-r border-border' : ''}`}
                >
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Scrollable Menu */}
            <div className="flex-1 overflow-y-auto py-2">
              {profileMenuSections.map((section, sIdx) => (
                <div key={section.title}>
                  {sIdx > 0 && <div className="mx-5 my-2 border-t border-border" />}
                  <p className="px-6 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {section.title}
                  </p>
                  {section.items.map((item, i) => (
                    <motion.button
                      key={item.label}
                      custom={sIdx * 3 + i}
                      variants={drawerItemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleProfileNavigation(item.href)}
                      className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-accent active:bg-accent/80 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 group-active:bg-primary/15 flex items-center justify-center transition-colors flex-shrink-0">
                        <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[15px] font-medium text-foreground/85 group-hover:text-foreground block">
                          {item.label}
                        </span>
                        <span className="text-xs text-muted-foreground/60 block mt-0.5 truncate">
                          {item.description}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              ))}

              {/* Dark mode toggle */}
              <div className="mx-5 my-2 border-t border-border" />
              <motion.button
                custom={10}
                variants={drawerItemVariants}
                initial="hidden"
                animate="visible"
                onClick={toggleColorMode}
                className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-accent active:bg-accent/80 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0">
                  {isDark ? (
                    <Sun className="w-5 h-5 text-foreground/70" />
                  ) : (
                    <Moon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[15px] font-medium text-foreground/85 group-hover:text-foreground block">
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </span>
                  <span className="text-xs text-muted-foreground/60 block mt-0.5">
                    Switch appearance
                  </span>
                </div>
                <div
                  className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-300 flex-shrink-0 ${
                    isDark ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <motion.div
                    animate={{ x: isDark ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-card shadow-md"
                  />
                </div>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-4 flex-shrink-0 bg-muted/40">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-destructive/10 hover:bg-destructive/15 active:bg-destructive/20 transition-all group"
              >
                <LogOut className="w-[18px] h-[18px] text-destructive transition-colors" />
                <span className="text-sm font-semibold text-destructive">
                  Sign out
                </span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ── Render ──────────────────────────────────────────────────

  return (
    <>
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-30 flex justify-between items-center px-4 md:px-6 h-14 border-b border-border bg-card/80 backdrop-blur-lg shadow-sm"
      >
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <motion.button
            variants={itemVariants}
            onClick={onMenuClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-accent rounded-xl transition-all duration-200 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </motion.button>

          <motion.div
            variants={itemVariants}
            className="hidden lg:flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/dashboard')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Dashboard
            </span>
          </motion.div>

<motion.div variants={itemVariants} className="hidden md:flex items-center relative">
  <motion.div
    variants={searchVariants}
    animate={searchFocused ? 'focus' : 'blur'}
    className="relative"
  >
    {/* Animated border - smooth pulsing glow */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={searchFocused ? { 
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.01, 1]
      } : { 
        opacity: 0,
        scale: 1
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none blur-[1px]"
    />
    
    {/* Static border - always visible when focused */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={searchFocused ? { opacity: 0.5 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 rounded-xl border-2 border-primary/40 pointer-events-none"
    />

    <motion.div
      animate={searchFocused ? { 
        scale: 1.05,
      } : { 
        scale: 1,
      }}
      transition={{ duration: 0.2 }}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
    >
      <Search className={`w-4 h-4 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
    </motion.div>
    
    <input
      type="text"
      placeholder="Search..."
      onFocus={() => setSearchFocused(true)}
      onBlur={() => setSearchFocused(false)}
      className="w-full pl-10 pr-4 py-2 bg-muted border border-transparent rounded-xl text-sm focus:outline-none focus:bg-card transition-all duration-200 text-foreground placeholder:text-muted-foreground relative z-[1]"
    />
    
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={searchFocused ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
    >
      <kbd className="px-2 py-0.5 text-xs bg-background border border-border rounded">
        ⌘K
      </kbd>
    </motion.div>
  </motion.div>
</motion.div>
        </div>

        {/* Right Section */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 md:gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 hover:bg-accent rounded-xl transition-all duration-200 relative"
          >
            <Search className="w-5 h-5 text-foreground/70" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleColorMode}
            className="hidden md:flex p-2 hover:bg-accent rounded-xl transition-all duration-200"
          >
            <motion.div animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isDark ? (
                <Sun className="w-5 h-5 text-foreground/70" />
              ) : (
                <Moon className="w-5 h-5 text-foreground/70" />
              )}
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 hover:bg-accent rounded-xl transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-foreground/70" />
              {unreadCount > 0 && (
                <motion.span
                  variants={notificationBadgeVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-80 bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, i) => (
                      <motion.div
                        key={notification.id}
                        custom={i}
                        variants={dropdownItemVariants}
                        initial="hidden"
                        animate="visible"
                        className={`p-4 hover:bg-accent cursor-pointer transition-colors border-b border-border/50 last:border-b-0 ${
                          notification.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.unread ? 'bg-primary' : 'bg-transparent'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground font-medium">{notification.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border bg-muted/50">
                    <button className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Button — avatar only */}
          <div ref={profileRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileClick}
              className="p-1 hover:bg-accent rounded-full transition-all duration-200"
              aria-label="Open profile menu"
            >
              <ProfileAvatar size="sm" />
            </motion.button>

            <DesktopProfileDropdown />
          </div>
        </motion.div>
      </motion.nav>

      <MobileProfileDrawer />
    </>
  );
};

export default Navbar;