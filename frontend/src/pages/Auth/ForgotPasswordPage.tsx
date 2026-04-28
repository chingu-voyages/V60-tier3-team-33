import React, { useState } from "react";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
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
      await apiClient.post("/forgot-password", data);
      setApiMessage({
        type: "success",
        text: "If an account exists, a reset link has been sent to your email.",
      });
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Unable to process request.";
        setApiMessage({ type: "error", text: errorMessage });
      } else {
        setApiMessage({
          type: "error",
          text: "An unexpected error occurred. Please check your connection.",
        });
      }
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-1 mb-8 text-left">
        <h2 className="text-[28px] font-bold text-white tracking-tight">
          Forgot password?
        </h2>
        <p className="text-[14px] text-[#9898A1]">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
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
                : "border-[#2A2A2A] focus:ring-[#D4F03D]/50"
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
          className="w-full py-3 mt-2 flex items-center justify-center gap-2 font-semibold rounded-xl bg-[#D4F03D] text-black hover:bg-[#C2DE32] disabled:opacity-70 disabled:cursor-not-allowed hover:underline transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin" />
          ) : (
            <>
              Send reset link
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center md:text-left">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-[#84848A] hover:text-white hover:underline transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
