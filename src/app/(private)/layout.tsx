'use client';

import { useState, FC, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import AuthGate from '@/hoc/authGate';
import Sidebar from '@/components/customSidebar/sidebar';
import Navbar from '@/components/customNavbar/navbar';

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout: FC<PrivateLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleToggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  // Animation for main content - properly typed with Variants
  const contentVariants: Variants = {
    hidden: { 
      opacity: 0 
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AuthGate>
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar onMenuClick={handleToggleSidebar} sidebarOpen={sidebarOpen} />

          {/* Page Content - Using motion.main for semantic HTML */}
          <motion.main
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 overflow-auto flex flex-col gap-4 p-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </AuthGate>
  );
};

export default PrivateLayout;