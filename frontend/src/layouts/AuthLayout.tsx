import React from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import authBg from '../assets/auth-bg.png';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  // 3D Flip Page Turn Variants
  const pageFlipVariants = {
    initial: {
      rotateY: -90,
      opacity: 0,
      scale: 0.95,
      transformPerspective: 1500,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformPerspective: 1500,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Custom bouncy ease out
      }
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      scale: 0.95,
      transformPerspective: 1500,
      transition: {
        duration: 0.6,
        ease: [0.7, 0, 0.84, 0], // Custom ease in
      }
    }
  };

  return (
    <div className="min-h-screen md:h-screen w-full flex items-center justify-center p-4 md:p-0 bg-white md:overflow-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-none bg-white md:w-full md:h-full overflow-hidden flex-1 md:flex-none">
        
        {/* Left Panel: Single Shared Viewport */}
        <div className="w-full md:w-1/3 flex items-stretch outline-none focus:outline-none h-full relative z-10 md:shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
          {/* AnimatePresence orchestrates the mounting/unmounting of the forms based on the URL */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageFlipVariants}
              className="w-full h-full flex flex-col items-center justify-center p-8 md:p-6 lg:p-10 xl:p-12 md:bg-white origin-right"
              style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel: Fixed Global Asset Placeholder */}
        <div className="hidden md:flex flex-1 md:w-2/3 bg-[#F3F7FA] md:border-l md:border-black md:rounded-l-[16px] items-center justify-center h-full relative z-20 overflow-hidden">
          <img src={authBg} alt="Workspace Illustration" className="w-full h-full object-cover" />
        </div>
        
      </div>
    </div>
  );
};

export default AuthLayout;
