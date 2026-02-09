'use client';

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/lib/authSlice';
import { useLogoutMutation } from '@/lib/api';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Navbar: FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

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

  // Container animation
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // Button hover animation
  const buttonHoverVariants: Variants = {
    rest: { scale: 1, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
    hover: { scale: 1.05, boxShadow: '0px 4px 12px rgba(239, 68, 68, 0.3)' },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white shadow-sm"
    >
      {/* Left Section - Menu Toggle */}
      <motion.button
        variants={itemVariants}
        onClick={onMenuClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5 text-slate-600" />
      </motion.button>

      {/* Center Section - Title */}
      <motion.div variants={itemVariants} className="flex-1 ml-4">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
      </motion.div>

      {/* Right Section - Quick Actions */}
      <motion.div variants={itemVariants} className="flex gap-3 items-center">
        {/* Go to Root Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="rounded bg-blue-500 px-4 py-2 text-white text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          Root
        </motion.button>

        {/* Go to Dashboard Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard')}
          className="rounded bg-green-500 px-4 py-2 text-white text-sm font-medium hover:bg-green-600 transition-colors duration-200"
        >
          Dashboard
        </motion.button>

        {/* Logout Button */}
        <motion.button
          variants={buttonHoverVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white text-sm font-medium hover:shadow-lg transition-shadow duration-200"
        >
          <motion.div
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <LogOut className="w-4 h-4" />
          </motion.div>
          <span>Logout</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;