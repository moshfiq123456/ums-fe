'use client';

import { useState, useEffect, FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import AuthGate from '@/hoc/authGate';
import Sidebar from '@/components/customSidebar/sidebar';
import Navbar from '@/components/customNavbar/navbar';
import { ThemeProvider } from '@/lib/theme-system';

interface PrivateLayoutProps {
  children: ReactNode;
}

// Module-level flag so it survives component remounts (key={pathname})
let hasMounted = false;

const PrivateLayout: FC<PrivateLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    hasMounted = true;
  }, []);

  const handleToggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <ThemeProvider>
      <AuthGate>
        <div className="relative flex h-screen bg-background overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />

          {/* Desktop sidebar toggle — floats at the sidebar's right edge, desktop only */}
          <motion.button
            onClick={handleToggleSidebar}
            animate={{ left: sidebarOpen ? '188px' : '68px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:flex absolute top-7 -translate-y-1/2 z-40 w-6 h-6 rounded-full bg-primary text-primary-foreground shadow-md items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </motion.button>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar onMenuClick={handleToggleSidebar} sidebarOpen={sidebarOpen} />

            <motion.main
              key={pathname}
              variants={contentVariants}
              initial={hasMounted ? "hidden" : false}
              animate="visible"
              className="flex-1 overflow-auto flex flex-col gap-4 p-6 bg-background"
            >
              {children}
            </motion.main>
          </div>
        </div>
      </AuthGate>
    </ThemeProvider>
  );
};

export default PrivateLayout;