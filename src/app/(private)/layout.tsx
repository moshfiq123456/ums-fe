'use client';

import { useState, FC, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import AuthGate from '@/hoc/authGate';
import Sidebar from '@/components/customSidebar/sidebar';
import Navbar from '@/components/customNavbar/navbar';
import { ThemeProvider } from '@/lib/theme-system';

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout: FC<PrivateLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

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
        <div className="flex h-screen bg-background">
          <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar onMenuClick={handleToggleSidebar} sidebarOpen={sidebarOpen} />

            <motion.main
              variants={contentVariants}
              initial="hidden"
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