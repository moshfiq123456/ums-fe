'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Home,
  BarChart3,
  Settings,
  MessageSquare,
  Users,
  FileText,
  X,
  ChevronRight,
  ChevronDown,
  LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const menuItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    {
      icon: BarChart3,
      label: 'Analytics',
      subItems: [
        { label: 'Overview', href: '/analytics/overview' },
        { label: 'Reports', href: '/analytics/reports' },
        { label: 'Metrics', href: '/analytics/metrics' },
      ],
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      subItems: [
        { label: 'Inbox', href: '/messages/inbox' },
        { label: 'Sent', href: '/messages/sent' },
        { label: 'Archived', href: '/messages/archived' },
      ],
    },
    {
      icon: Users,
      label: 'Team',
      subItems: [
        { label: 'Members', href: '/team/members' },
        { label: 'Roles', href: '/team/roles' },
        { label: 'Permissions', href: '/team/permissions' },
      ],
    },
    { icon: FileText, label: 'Documents', href: '/documents' },
    {
      icon: Settings,
      label: 'Settings',
      subItems: [
        { label: 'Profile', href: '/settings/profile' },
        { label: 'Security', href: '/settings/security' },
        { label: 'Preferences', href: '/settings/preferences' },
      ],
    },
  ];

  const desktopSidebarVariants: Variants = {
    open: {
      width: '280px',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      width: '80px',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const mobileSidebarVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      x: '-100vw',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const submenuContainerVariants: Variants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const submenuItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  };

  const dropdownItemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  };

  const toggleExpanded = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleNavigation = (href: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    router.push(href);
    if (isMobile && isOpen) onToggle();
    setOpenDropdown(null);
  };

  const handleMenuItemClick = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isMobile && !isOpen && item.subItems) {
      if (openDropdown === item.label) {
        setOpenDropdown(null);
      } else {
        const button = menuItemRefs.current[item.label];
        if (button) {
          const rect = button.getBoundingClientRect();
          setDropdownPosition({ top: rect.top, left: rect.right + 32 });
        }
        setOpenDropdown(item.label);
      }
      return;
    }

    if (!isMobile && isOpen && item.subItems) {
      toggleExpanded(item.label, e);
      return;
    }

    if (isMobile && item.subItems) {
      toggleExpanded(item.label, e);
      return;
    }

    if (item.href) handleNavigation(item.href, e);
  };

  const handleBackdropClick = () => setOpenDropdown(null);

  return (
    <>
      {/* Dropdown Backdrop */}
      {!isMobile && !isOpen && openDropdown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-30"
        />
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onToggle}
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden backdrop-blur-sm"
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={isMobile ? mobileSidebarVariants : desktopSidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        style={{ width: isMobile ? '100vw' : 'auto' }}
        className={`${
          isMobile ? 'fixed left-0 top-0 h-screen z-50' : 'relative'
        } bg-sidebar shadow-2xl flex flex-col overflow-hidden border-r border-sidebar-border`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-sidebar-border flex-shrink-0">
          <motion.div
            animate={{
              opacity: isMobile ? 1 : isOpen ? 1 : 0,
              width: isMobile ? 'auto' : isOpen ? 'auto' : 0,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
            <span className="text-sidebar-foreground font-bold text-lg tracking-tight">Nav</span>
          </motion.div>

          <button
            onClick={onToggle}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors duration-200 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-sidebar-foreground/60" />
              ) : (
                <Menu className="w-5 h-5 text-sidebar-foreground/60" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                {/* Main Menu Item */}
                <motion.button
                  ref={(el) => {
                    if (el) menuItemRefs.current[item.label] = el;
                  }}
                  onClick={(e) => handleMenuItemClick(item, e)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 group cursor-pointer relative overflow-hidden"
                >
                  {/* Background glow on hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-300" />

                  <div className="relative flex-shrink-0">
                    <item.icon className="w-5 h-5 group-hover:text-primary transition-colors duration-200" />
                  </div>

                  <motion.span
                    animate={!isMobile && isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>

                  {/* Chevron indicator for expanded state */}
                  {item.subItems && (isOpen || isMobile) && (
                    <motion.div
                      className="ml-auto flex-shrink-0"
                      animate={{ rotate: expandedItems.includes(item.label) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  )}

                  {/* Right arrow for items without submenu */}
                  {!item.subItems && !isMobile && isOpen && (
                    <motion.div
                      className="ml-auto flex-shrink-0"
                      animate={{ x: 0, opacity: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}

                  {/* Submenu indicator for collapsed mode */}
                  {item.subItems && !isMobile && !isOpen && (
                    <motion.div
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 flex-shrink-0"
                      animate={{
                        opacity: openDropdown === item.label ? 1 : 0.7,
                        scale: openDropdown === item.label ? 1.3 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Dropdown Popup (Desktop Collapsed) */}
                {!isMobile && !isOpen && item.subItems && openDropdown === item.label && dropdownPosition && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed z-40"
                    style={{
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                    }}
                  >
                    <div className="bg-card rounded-lg shadow-2xl border border-border overflow-visible w-72">
                      {item.subItems.map((subItem, idx) => (
                        <motion.button
                          key={subItem.label}
                          custom={idx}
                          variants={dropdownItemVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={(e) => handleNavigation(subItem.href, e)}
                          className="w-full text-left px-6 py-3.5 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-all duration-200 block hover:rounded-md"
                        >
                          {subItem.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Submenu Items (Expanded Desktop/Mobile) */}
                {item.subItems && (isOpen || isMobile) && (
                  <motion.div
                    variants={submenuContainerVariants}
                    initial="hidden"
                    animate={expandedItems.includes(item.label) ? 'visible' : 'hidden'}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 space-y-1 border-l border-sidebar-border pl-4 py-2">
                      {item.subItems.map((subItem) => (
                        <motion.button
                          key={subItem.label}
                          onClick={(e) => handleNavigation(subItem.href, e)}
                          variants={submenuItemVariants}
                          className="w-full text-left px-4 py-2 rounded-lg text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-300" />
                          <span className="relative">{subItem.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer - Close button for mobile */}
        {isMobile && (
          <div className="border-t border-sidebar-border px-4 py-4 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggle}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              Close Menu
            </motion.button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;