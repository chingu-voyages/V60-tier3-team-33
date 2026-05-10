import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setApiMessage(null);
    try {
      const response = await authService.login(data);
      if (response.access_token) {
        localStorage.setItem("auth_token", response.access_token);
      }
      setApiMessage({ type: "success", text: "Successfully logged in!" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Invalid email or password.";
        setApiMessage({ type: "error", text: errorMessage });
      } else {
        setApiMessage({ type: "error", text: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex flex-col gap-1 text-left">
        <h2 className="text-[28px] font-bold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="text-[14px] text-[#9898A1]">
          Sign in to your account to continue
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className={`w-full rounded-xl border bg-[#1A1A1A] px-4 py-3 text-sm transition-all duration-200 ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-[#2A2A2A] focus:border-[#F2FF53] focus:ring-2 focus:ring-[#F2FF53]/20"
            } text-white placeholder-[#84848A] shadow-sm focus:outline-none`}
          />
          {errors.email && (
            <p className="mt-1.5 text-[12px] text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-500">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="cursor-pointer text-xs text-[#F2FF53] transition-colors hover:text-[#f4ffa3] hover:underline"
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
              className={`w-full rounded-xl border bg-[#1A1A1A] px-4 py-3 text-sm transition-all duration-200 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-[#2A2A2A] focus:border-[#F2FF53] focus:ring-2 focus:ring-[#F2FF53]/20"
              } text-white placeholder-[#84848A] shadow-sm focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-[#52525B] transition-colors hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
              ) : (
                <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[12px] text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {apiMessage && (
          <div
            className={`rounded-xl p-3 text-[13px] font-medium transition-all ${
              apiMessage.type === "error"
                ? "border border-red-500/20 bg-red-500/10 text-red-500"
                : "border border-[#F2FF53]/20 bg-[#F2FF53]/10 text-[#F2FF53]"
            }`}
          >
            {apiMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F2FF53] py-3 font-semibold text-black transition-colors hover:bg-[#e8f53b] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 flex items-center justify-center text-[14px] text-[#9898A1] md:mt-8">
        Don't have an account?&nbsp;
        <Link
          to="/register"
          className="cursor-pointer font-semibold text-[#F2FF53] transition-colors hover:text-[#f4ffa3] hover:underline"
        >
          Create one
        </Link>
      </div>
      <div className="mt-auto text-[#9898A1] text-center text-xs leading-5">
        <div className="">© 2026 Applytics</div>
        <a href="https://linkedin.com/in/zuwaira-aliyu-mohammed" target="_blank" className="whitespace-nowrap hover:underline">Zuwee Ali </a><span className="text-[#F2FF53]"> | </span>
        <a href="https://github.com/Afubasic" target="_blank" className="whitespace-nowrap hover:underline"> Afuwape Babatunde </a><span className="text-[#F2FF53]"> | </span>
        <a href="https://github.com/HoneyVanya" target="_blank" className="whitespace-nowrap hover:underline"> Ivan Brovko </a><span className="text-[#F2FF53]"> | </span>
        <a href="https://github.com/minezzig" target="_blank" className="whitespace-nowrap hover:underline"> Greg Minezzi </a><span className="text-[#F2FF53]"> | </span>
        <a href="https://github.com/opruz" target="_blank" className="whitespace-nowrap hover:underline"> Olivia Prusinowski </a><span className="text-[#F2FF53]"> | </span>
        <a href="https://github.com/AskTiba" target="_blank" className="whitespace-nowrap hover:underline"> Anthony Tibamwenda </a>
      </div>
    </div>
  );
};

export default LoginPage;

