import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "../../api/auth";
import axios from "axios";

// Define the schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setApiMessage(null);
    try {
      const response = await authService.login(data);
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
      }
      setApiMessage({ type: "success", text: "Successfully logged in!" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Invalid email or password.";
        setApiMessage({ type: "error", text: errorMessage });
      } else {
        setApiMessage({ type: "error", text: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-1 mb-8 text-left">
        <h2 className="text-[28px] font-bold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-[14px] text-[#9898A1]">
          Sign in to your account to continue
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
            className={`w-full px-4 py-3 rounded-xl text-sm bg-[#1A1A1A] border transition-all duration-200 ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-[#2A2A2A] focus:border-[#F2FF53] focus:ring-2 focus:ring-[#F2FF53]/20"
            } shadow-sm text-white placeholder-[#84848A] focus:outline-none`}
          />
          {errors.email && (
            <p className="text-red-500 text-[12px] mt-1.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#F2FF53] hover:text-[#f4ffa3] hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative w-full">
            <input
              placeholder="••••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className={`w-full px-4 py-3 rounded-xl text-sm bg-[#1A1A1A] border transition-all duration-200 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-[#2A2A2A] focus:border-[#F2FF53] focus:ring-2 focus:ring-[#F2FF53]/20"
              } shadow-sm text-white placeholder-[#84848A] focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525B] hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
              ) : (
                <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[12px] mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {apiMessage && (
          <div
            className={`p-3 rounded-xl text-[13px] font-medium transition-all ${
              apiMessage.type === "error"
                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                : "bg-[#F2FF53]/10 text-[#F2FF53] border border-[#F2FF53]/20"
            }`}
          >
            {apiMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-2 flex items-center justify-center gap-2 font-semibold rounded-xl bg-[#F2FF53] text-black hover:bg-[#e8f53b] disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <div className="flex justify-center items-center mt-12 md:mt-8 text-[#9898A1] text-[14px]">
        Don't have an account?&nbsp;
        <Link
          to="/register"
          className="text-[#F2FF53] hover:text-[#f4ffa3] hover:underline font-semibold transition-colors cursor-pointer"
        >
          Create one
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
