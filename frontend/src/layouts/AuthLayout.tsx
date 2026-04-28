import React from "react";
import { useOutlet, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import logo from "../assets/applytics-logo.svg";
import animation from "../assets/gradient-animation-1776606389007.webm";

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  const isPasswordResetFlow =
    location.pathname.includes("forgot-password") ||
    location.pathname.includes("reset-password");

  return (
    <div className="min-h-screen md:h-screen w-full flex items-center justify-center bg-[#0F0F0F] md:overflow-hidden text-white font-sans selection:bg-[#E3F05B] selection:text-black">
      <div className="flex flex-col md:flex-row w-full bg-[#0E0E0E] md:w-full md:h-full overflow-hidden">
        {/* Left Panel: Auth Forms */}
        <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] flex flex-col items-center outline-none focus:outline-none h-screen md:h-full relative z-30 bg-[#0F0F0F] border-r border-[#1F1F22] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#27272A] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="w-full flex flex-col items-center px-6 md:px-8 lg:px-12 pt-10 md:pt-14 pb-10 transition-all">
            {/* Logo - Anchored Top */}
            <div className="w-full mb-8 md:mb-12 flex-none">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Applytics" className="h-6 w-auto" />
              </div>
            </div>

            {/* Form Wrapper - Spacing matches Logo */}
            <div className="w-full flex-1">
              <div className="w-full">{outlet}</div>
            </div>
          </div>
        </div>

        {/* Right Panel: Feature Grid */}
        <div className="hidden md:flex flex-1 md:w-[55%] lg:w-[60%] xl:w-[65%] items-end justify-start h-full relative z-10 overflow-hidden bg-[#0A0A0A]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-screen pointer-events-none"
            src={animation}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0B05] via-[#0A0B05]/20 to-transparent z-0 pointer-events-none"></div>

          <div className="relative z-10 px-8 lg:px-10 pb-8 lg:pb-12 xl:pb-14 w-full max-w-4xl">
            {isPasswordResetFlow ? (
              <div className="">
                <h3 className="text-xl lg:text-xl xl:text-xl font-semibold text-white leading-snug mb-4 tracking-tight">
                  Your next opportunity <br className="hidden lg:block" /> is
                  one application away.
                </h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                  Applytics keeps your entire job search organized in one place.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-6 ml-1">
                  Everything you need for your job search
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                    <div key={idx} className="flex gap-2">
                      <div className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#1F1935] shrink-0 mt-0.5 border border-[#3A2E63]">
                        <CheckCircle2
                          className="w-[14px] h-[14px] text-[#A688FF]"
                          strokeWidth={3}
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-1.5">
                          {item.title}
                        </h4>
                        <p className="text-white/70 text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
