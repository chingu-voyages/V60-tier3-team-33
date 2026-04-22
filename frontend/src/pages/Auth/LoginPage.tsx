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
      // TODO: Handle routing to Dashboard
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          // Display backend errors as a unified banner message instead of field-specific text
          const validationErrors: Record<string, string[]> =
            error.response.data.errors || {};
          const firstErrorKey = Object.keys(validationErrors)[0];
          const errorMessage = firstErrorKey
            ? validationErrors[firstErrorKey][0]
            : error.response.data.message || "Invalid credentials provided.";

          setApiMessage({ type: "error", text: errorMessage });
        } else {
          // General Backend Failure (e.g. 401 Unauthorized)
          setApiMessage({
            type: "error",
            text:
              error.response.data.message ||
              "Invalid email or password. Please try again.",
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
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-1 mb-8 text-left">
        <h2 className="text-[28px] font-bold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-[14px] text-[#A1A1AA]">
          Sign in to your account to continue
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1.5 text-[13px] text-[#84848A] font-medium"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="off"
            {...register("email")}
            className={`bg-[#18181B] border px-3.5 focus:border-[#E3F05B] focus:ring-1 focus:ring-[#E3F05B] outline-none transition-all rounded-[8px] h-[44px] w-full text-white placeholder-[#52525B] text-[14px] font-medium ${errors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#27272A]"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-[12px] mt-1.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="password"
              className="text-[13px] text-[#84848A] font-medium"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[13px] text-[#E3F05B] hover:text-[#f4ffa3] font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative w-full">
            <input
              id="password"
              placeholder="••••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("password")}
              className={`bg-[#18181B] border pl-3.5 pr-10 focus:border-[#E3F05B] focus:ring-1 focus:ring-[#E3F05B] outline-none transition-all rounded-[8px] h-[44px] w-full text-white placeholder-[#52525B] text-[14px] font-medium ${errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#27272A]"}`}
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
            className={`p-3 rounded-[8px] text-[13px] font-medium transition-all ${
              apiMessage.type === "error"
                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                : "bg-[#E3F05B]/10 text-[#E3F05B] border border-[#E3F05B]/20"
            }`}
          >
            {apiMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#E3F05B] text-black text-[15px] font-semibold rounded-[8px] h-[44px] w-full hover:bg-[#D3E04F] disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-1 flex flex-row items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin" />
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <div className="flex justify-center items-center mt-12 md:mt-8 text-[#A1A1AA] text-[14px]">
        Don't have an account?&nbsp;
        <Link
          to="/register"
          className="text-[#E3F05B] hover:text-[#f4ffa3] font-semibold transition-colors cursor-pointer"
        >
          Create one
        </Link>
      </div>

      <div className="flex justify-center w-full mt-[60px]">
        <span className="text-[#3F3F46] text-[12px]">
          Demo: any email + any password (6+ chars)
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
