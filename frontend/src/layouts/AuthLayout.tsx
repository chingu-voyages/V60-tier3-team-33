import React from "react";
import { useOutlet } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const AuthLayout: React.FC = () => {
  const outlet = useOutlet();

  return (
    <div className="min-h-screen md:h-screen w-full flex items-center justify-center bg-[#000000] md:overflow-hidden text-white font-sans selection:bg-[#E3F05B] selection:text-black">
      <div className="flex flex-col md:flex-row w-full bg-[#0E0E0E] md:w-full md:h-full overflow-hidden">
        {/* Left Panel: Auth Forms */}
        <div className="w-full md:w-[40%] xl:w-[35%] flex flex-col items-center outline-none focus:outline-none h-screen md:h-full relative z-30 bg-[#0A0A0A] border-r border-[#1F1F22] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#27272A] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="w-full min-h-full flex flex-col items-center px-6 md:px-8 lg:px-10 pt-10 md:pt-14 pb-10 transition-all">
              {/* Logo explicitly disconnected from vertical centering logic to guarantee absolute symmetry between pages */}
              <div className="w-full max-w-[340px] mb-8 md:mb-12 flex-none">
                <div className="flex items-center gap-2">
                  <div className="w-[18px] h-[18px] flex flex-wrap gap-[2px]">
                    <div className="w-[8px] h-[8px] bg-white rounded-[1.5px]"></div>
                    <div className="w-[8px] h-[8px] bg-white rounded-[1.5px]"></div>
                    <div className="w-[8px] h-[8px] bg-white opacity-40 rounded-[1.5px]"></div>
                    <div className="w-[8px] h-[8px] border-[1.5px] border-white rounded-[1.5px]"></div>
                  </div>
                  <span className="font-semibold text-lg text-white tracking-tight">
                    Applytics
                  </span>
                </div>
              </div>

              {/* Form Wrapper dynamically centers ONLY inside remaining viewport space */}
              <div className="w-full max-w-[340px] flex-1 flex flex-col justify-center">
                <div className="w-full">{outlet}</div>
              </div>
            </div>
        </div>

        {/* Right Panel: Glowing background and Feature Grid exactly copying the source screenshot */}
        <div className="hidden md:flex flex-1 md:w-[60%] xl:w-[65%] items-end justify-start h-full relative z-10 overflow-hidden bg-[#0A0A0A]">
          {/* Applytics Abstract Aurora Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-screen pointer-events-none"
            src="https://applytics-design.vercel.app/assets/gradient-animation-1776606389007-CFcqnpS6.webm"
          />
          {/* Subtle gradient overlay to provide contrast for text against bright video areas */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0B05] via-[#0A0B05]/20 to-transparent z-0 pointer-events-none"></div>

          {/* Social Proof Overlay Content pinned to the bottom left matching the exact text mapping */}
          <div className="relative z-10 px-10 pb-8 lg:pb-12 xl:pb-14  lg:px-16 xl:px-8 w-full max-w-4xl">
            <h3 className="text-[#84848A] text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase mb-6 ml-1">
              Everything you need for your job search
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Track every application",
                  desc: "One place for every job — no more lost emails or spreadsheets.",
                },
                {
                  title: "Smart follow-up reminders",
                  desc: "Automatic task suggestions based on how long applications sit.",
                },
                {
                  title: "Visualize your pipeline",
                  desc: "Charts and metrics to understand your conversion rates.",
                },
                {
                  title: "Clipboard-ready links",
                  desc: "Copy your LinkedIn, portfolio, or resume URL in one click.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  {/* Purple Applytics checkmark style background circle */}
                  <div className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#1F1935] shrink-0 mt-0.5 border border-[#3A2E63]">
                    <CheckCircle2
                      className="w-[14px] h-[14px] text-[#A688FF]"
                      strokeWidth={3}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-[14px] mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-[#9898A1] text-[12px] leading-[1.6]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
