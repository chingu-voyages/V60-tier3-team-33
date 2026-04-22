import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import apiClient from "../../api/client";

// Define the schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [apiMessage, setApiMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setApiMessage(null);
    try {
      // Direct call to API assuming conventional Laravel endpoint or mock it
      await apiClient.post("/forgot-password", data);

      setApiMessage({
        type: "success",
        text: "If an account exists, a reset link has been sent to your email.",
      });
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          const validationErrors: Record<string, string[]> =
            error.response.data.errors || {};
          const firstErrorKey = Object.keys(validationErrors)[0];
          const errorMessage = firstErrorKey
            ? validationErrors[firstErrorKey][0]
            : error.response.data.message || "Invalid request.";
          setApiMessage({ type: "error", text: errorMessage });
        } else {
          setApiMessage({
            type: "error",
            text:
              error.response.data.message ||
              "Unable to process request. Please try again.",
          });
        }
      } else {
        setApiMessage({
          type: "error",
          text: "An unexpected error occurred. Please check your connection.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen md:h-screen w-full flex items-center justify-center bg-[#000000] md:overflow-hidden text-white font-sans selection:bg-[#D4F03D] selection:text-black">
      <div className="flex flex-col md:flex-row w-full bg-[#0E0E0E] md:w-full md:h-full overflow-hidden">
        {/* Left Panel: Auth Forms */}
        <div className="w-full md:w-[40%] xl:w-[35%] flex items-stretch outline-none focus:outline-none h-screen md:h-full relative z-30 bg-[#0A0A0A] border-r border-[#1F1F22] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#27272A] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="w-full min-h-full flex flex-col items-center px-6 md:px-8 lg:px-10 pt-10 md:pt-14 pb-10 transition-all">
            {/* Logo */}
            <div className="w-full max-w-[340px] mb-8 md:mb-12 flex-none">
              <div className="flex items-center gap-2">
                <div className="w-[18px] h-[18px] flex flex-wrap gap-[2px]">
                  <div className="w-[8px] h-[8px] bg-white rounded-[1.5px]"></div>
                  <div className="w-[8px] h-[8px] bg-white rounded-[1.5px]"></div>
                  <div className="w-[8px] h-[8px] bg-white opacity-40 rounded-[1.5px]"></div>
                  <div className="w-[8px] h-[8px] border-[1.5px] border-white rounded-[1.5px]"></div>
                </div>
                <span className="text-lg text-white tracking-tight">
                  <span className="font-bold">Apply</span>
                  <span className="font-normal">tics</span>
                </span>
              </div>
            </div>

            {/* Form Wrapper */}
            <div className="w-full max-w-[340px] flex-1 flex flex-col justify-center">
              <div className="w-full">
                <h2 className="text-[28px] font-bold text-white tracking-tight">
                  Forgot password?
                </h2>
                <p className="mt-2 text-sm text-[#9898A1] mb-8">
                  Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-[#84848A] mb-1.5 tracking-wider">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...register("email")}
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-[#1A1A1A] border ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#2A2A2A] focus:ring-[#A688FF]/50"
                      } shadow-sm text-white placeholder-[#84848A] focus:outline-none focus:ring-2 transition-all`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[12px] mt-1.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {apiMessage && (
                    <div
                      className={`p-3 rounded-xl text-[13px] font-medium transition-all ${
                        apiMessage.type === "error"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-[#D4F03D]/10 text-[#D4F03D] border border-[#D4F03D]/20"
                      }`}
                    >
                      {apiMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 mt-2 flex items-center justify-center gap-2 font-semibold rounded-xl bg-[#D4F03D] text-black hover:bg-[#C2DE32] disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-[18px] h-[18px] animate-spin" />
                    ) : (
                      <>
                        Send reset link
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {/* Navigation Link */}
                <div className="mt-8 text-center md:text-left">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-[#84848A] hover:text-white transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Decorative Section */}
        <div className="hidden md:flex flex-1 md:w-[60%] xl:w-[65%] items-end justify-start h-full relative z-10 overflow-hidden bg-[#0A0A0A]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-screen pointer-events-none"
            src="https://applytics-design.vercel.app/assets/gradient-animation-1776606389007-CFcqnpS6.webm"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0B05] via-[#0A0B05]/20 to-transparent z-0 pointer-events-none"></div>
          <div className="relative z-10 px-10 pb-8 lg:pb-12 xl:pb-14 lg:px-16 xl:px-8 w-full max-w-4xl">
            <h3 className="text-3xl lg:text-xl font-bold lg:font-normal xl:font-medium text-white leading-tight mb-4 tracking-tight">
              Your next opportunity <br className="hidden lg:block" /> is one
              application away.
            </h3>
            <p className="text-[#9898A1] text-sm lg:text-sm xl:text-sm leading-relaxed max-w-lg">
              Applytics keeps your entire job search organized in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
