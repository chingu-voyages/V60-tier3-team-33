import React from 'react';
import { useOutlet } from 'react-router-dom';
import authBg from '../assets/auth-bg.png';

const AuthLayout: React.FC = () => {
  const outlet = useOutlet();

  return (
    <div className="min-h-screen md:h-screen w-full flex items-center justify-center p-4 md:p-0 bg-white md:overflow-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-none bg-white md:w-full md:h-full overflow-hidden flex-1 md:flex-none">
        
        {/* Left Panel: Auth Forms */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-8 md:p-6 lg:p-10 xl:p-12 md:bg-white relative z-10 md:shadow-[1px_0_10px_rgba(0,0,0,0.02)] h-full">
           {outlet}
        </div>

        {/* Right Panel: Shared Image */}
        <div className="hidden md:flex flex-1 md:w-2/3 bg-[#F3F7FA] md:border-l md:border-black md:rounded-l-[16px] items-center justify-center h-full relative z-20 overflow-hidden">
          <img src={authBg} alt="Workspace Illustration" className="w-full h-full object-cover" />
        </div>
        
      </div>
    </div>
  );
};

export default AuthLayout;
