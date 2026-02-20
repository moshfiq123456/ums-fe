'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Home,
  BarChart3,
  Settings,
  MessageSquare,
  Users,
  FileText,
  X,
  ChevronDown,
  Sun,
  Moon,
  LucideIcon,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/lib/theme-system';

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

interface MenuSection {
  label: string;
  items: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { colorMode, resolvedMode, setColorMode } = useTheme();

  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null);

  const menuItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close dropdown & tooltip when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setOpenDropdown(null);
      setTooltip(null);
    }
  }, [isOpen]);

  const sections: MenuSection[] = [
    {
      label: 'MAIN',
      items: [
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
      ],
    },
    {
      label: 'SETTINGS',
      items: [
        {
          icon: Settings,
          label: 'Settings',
          subItems: [
            { label: 'Profile', href: '/settings/profile' },
            { label: 'Security', href: '/settings/security' },
            { label: 'Preferences', href: '/settings/preferences' },
          ],
        },
      ],
    },
  ];

  const isParentActive = (item: MenuItem) =>
    item.href
      ? pathname === item.href
      : (item.subItems?.some((s) => pathname === s.href) ?? false);

  // ─── Motion Variants ──────────────────────────────────────

  const desktopSidebarVariants: Variants = {
    open: { width: '200px', transition: { duration: 0.3, ease: 'easeInOut' } },
    closed: { width: '80px', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const mobileSidebarVariants: Variants = {
    open: { x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    closed: { x: '-100%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const submenuVariants: Variants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.25, staggerChildren: 0.04, delayChildren: 0.05 },
    },
  };

  const submenuItemVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.15 } },
  };

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, x: -4 },
    visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.15, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
  };

  // ─── Handlers ────────────────────────────────────────────

  const handleMenuItemClick = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setTooltip(null);

    if (!isMobile && !isOpen && item.subItems) {
      if (openDropdown === item.label) {
        setOpenDropdown(null);
      } else {
        const btn = menuItemRefs.current[item.label];
        if (btn) {
          const rect = btn.getBoundingClientRect();
          setDropdownPosition({ top: rect.top, left: rect.right + 8 });
        }
        setOpenDropdown(item.label);
      }
      return;
    }

    if (item.subItems) {
      setExpandedItems((prev) =>
        prev.includes(item.label)
          ? prev.filter((i) => i !== item.label)
          : [...prev, item.label]
      );
      return;
    }

    if (item.href) {
      router.push(item.href);
      if (isMobile && isOpen) onToggle();
    }
  };

  const handleMouseEnter = (label: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobile && !isOpen && openDropdown === null) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({ label, top: rect.top + rect.height / 2, left: rect.right + 8 });
    }
  };

  const handleMouseLeave = () => setTooltip(null);

  // Find the currently open dropdown item across all sections
  const activeDropdownItem = sections
    .flatMap((s) => s.items)
    .find((i) => i.label === openDropdown);

  // ─── Render ───────────────────────────────────────────────

  return (
    <>
      {/* Tooltip — rendered outside sidebar to escape overflow:hidden */}
      {tooltip && (
        <div
          className="fixed z-100 pointer-events-none"
          style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)' }}
        >
          <div className="bg-foreground text-background text-xs px-2.5 py-1 rounded-md whitespace-nowrap shadow-md">
            {tooltip.label}
          </div>
        </div>
      )}

      {/* Floating dropdown panel (collapsed desktop) — outside sidebar */}
      {!isMobile && !isOpen && openDropdown && dropdownPosition && activeDropdownItem?.subItems && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-40 bg-card rounded-lg shadow-lg border border-border overflow-hidden min-w-40"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          >
            <p className="text-[10px] font-semibold tracking-widest text-foreground/40 px-4 pt-3 pb-1.5">
              {openDropdown.toUpperCase()}
            </p>
            {activeDropdownItem.subItems.map((sub) => (
              <button
                key={sub.label}
                onClick={() => {
                  router.push(sub.href);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  pathname === sub.href
                    ? 'text-foreground font-semibold bg-accent/60'
                    : 'text-foreground/60 hover:text-foreground hover:bg-accent'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </motion.div>
        </>
      )}

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onToggle}
          className="fixed inset-0 bg-foreground/20 z-40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={isMobile ? mobileSidebarVariants : desktopSidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        className={`${
          isMobile ? 'fixed left-0 top-0 h-screen z-50 w-65' : 'relative'
        } bg-sidebar flex flex-col overflow-hidden border-r border-sidebar-border`}
      >
        {/* Header */}
        <div
          className={`flex items-center h-14 shrink-0 border-b border-sidebar-border ${
            !isMobile && !isOpen ? 'justify-center px-0' : 'justify-between px-4'
          }`}
        >
          {/* Logo — icon always visible, text only when open */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-xs">N</span>
            </div>
            {(isOpen || isMobile) && (
              <span className="text-sidebar-foreground font-semibold text-sm truncate">Nav</span>
            )}
          </div>

          {/* Mobile only: close button */}
          {isMobile && (
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-sidebar-accent rounded-md transition-colors shrink-0"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 text-sidebar-foreground/50" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {sections.map((section, sIdx) => (
            <div key={section.label} className={sIdx > 0 ? 'mt-3' : ''}>
              {/* Section label (open mode) */}
              {(isOpen || isMobile) ? (
                <p className="text-[10px] font-semibold tracking-widest text-sidebar-foreground/40 px-4 pt-3 pb-2">
                  {section.label}
                </p>
              ) : (
                /* Divider between sections (collapsed mode) */
                sIdx > 0 && <div className="mx-3 mb-2 border-t border-sidebar-border" />
              )}

              {/* Items */}
              <div className="px-2 space-y-0.5">
                {section.items.map((item) => {
                  const active = isParentActive(item);
                  const expanded = expandedItems.includes(item.label);

                  return (
                    <div key={item.label}>
                      <button
                        ref={(el) => { if (el) menuItemRefs.current[item.label] = el; }}
                        onClick={(e) => handleMenuItemClick(item, e)}
                        onMouseEnter={(e) => handleMouseEnter(item.label, e)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-full flex items-center gap-2.5 py-2 rounded-md text-sm transition-colors duration-150 ${
                          !isMobile && !isOpen ? 'justify-center px-0' : 'px-3'
                        } ${
                          active
                            ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                            : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                        }`}
                      >
                        <item.icon
                          className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : ''}`}
                        />
                        {(isOpen || isMobile) && (
                          <>
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.subItems && (
                              <motion.div
                                className="shrink-0"
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/40" />
                              </motion.div>
                            )}
                          </>
                        )}
                      </button>

                      {/* Inline submenu (open mode) */}
                      {item.subItems && (isOpen || isMobile) && (
                        <motion.div
                          variants={submenuVariants}
                          initial="hidden"
                          animate={expanded ? 'visible' : 'hidden'}
                          className="overflow-hidden"
                        >
                          <div className="ml-7 mt-0.5 mb-1 space-y-0.5">
                            {item.subItems.map((sub, idx, arr) => {
                              const isLast = idx === arr.length - 1;
                              return (
                                <div key={sub.label} className="relative">
                                  {/* Vertical line — full height for middle items, half for last */}
                                  <div
                                    className={`absolute left-0 w-px bg-sidebar-border ${
                                      isLast ? 'top-0 h-1/2' : 'inset-y-0'
                                    }`}
                                  />
                                  {/* Horizontal connector */}
                                  <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-sidebar-border" />
                                  <motion.button
                                    variants={submenuItemVariants}
                                    onClick={() => {
                                      router.push(sub.href);
                                      if (isMobile && isOpen) onToggle();
                                    }}
                                    className={`relative w-full text-left pl-5 pr-3 py-1.5 rounded-md text-sm transition-colors ${
                                      pathname === sub.href
                                        ? 'text-sidebar-foreground font-semibold'
                                        : 'text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/40'
                                    }`}
                                  >
                                    {sub.label}
                                  </motion.button>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — Light / Dark toggle */}
        <div
          className={`border-t border-sidebar-border shrink-0 ${
            !isMobile && !isOpen ? 'px-2 py-3' : 'px-3 py-3'
          }`}
        >
          {!isMobile && !isOpen ? (
            /* Collapsed: single icon button */
            <button
              onClick={() => setColorMode(resolvedMode === 'dark' ? 'light' : 'dark')}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  label: resolvedMode === 'dark' ? 'Light mode' : 'Dark mode',
                  top: rect.top + rect.height / 2,
                  left: rect.right + 8,
                });
              }}
              onMouseLeave={handleMouseLeave}
              className="w-full flex items-center justify-center p-2 rounded-md hover:bg-sidebar-accent transition-colors"
            >
              {resolvedMode === 'dark' ? (
                <Sun className="w-4 h-4 text-sidebar-foreground/60" />
              ) : (
                <Moon className="w-4 h-4 text-sidebar-foreground/60" />
              )}
            </button>
          ) : (
            /* Open: segmented Light / Dark toggle */
            <div className="flex items-center gap-1 bg-sidebar-accent rounded-lg p-1">
              <button
                onClick={() => setColorMode('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                  colorMode !== 'dark'
                    ? 'bg-sidebar text-sidebar-foreground shadow-sm'
                    : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'
                }`}
              >
                <Sun className="w-3 h-3" />
                Light
              </button>
              <button
                onClick={() => setColorMode('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                  colorMode === 'dark'
                    ? 'bg-sidebar text-sidebar-foreground shadow-sm'
                    : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'
                }`}
              >
                <Moon className="w-3 h-3" />
                Dark
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
