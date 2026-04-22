import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "../../api/auth";
import axios from "axios";

const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

const AccountCreationPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (data: RegisterFormInputs) => {
    setApiMessage(null);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      };

      const response = await authService.register(payload);
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
      }
      setApiMessage({
        type: "success",
        text: "Account created successfully! Redirecting...",
      });
      // TODO: Handle routing to Dashboard
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          const validationErrors: Record<string, string[]> =
            error.response.data.errors || {};
          const firstErrorKey = Object.keys(validationErrors)[0];
          const errorMessage = firstErrorKey
            ? validationErrors[firstErrorKey][0]
            : error.response.data.message || "Please check the provided data.";

          setApiMessage({ type: "error", text: errorMessage });
        } else {
          setApiMessage({
            type: "error",
            text:
              error.response.data.message ||
              "Registration failed. Please try again.",
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
          Create account
        </h2>
        <p className="text-[14px] text-[#A1A1AA]">
          Get started with your 30-day free trial
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-1.5 text-[13px] text-[#84848A] font-medium"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Michael Scott"
            autoComplete="off"
            {...register("name")}
            className={`bg-[#18181B] border px-3.5 focus:border-[#E3F05B] focus:ring-1 focus:ring-[#E3F05B] outline-none transition-all rounded-[8px] h-[44px] w-full text-white placeholder-[#52525B] text-[14px] font-medium ${errors.name ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#27272A]"}`}
          />
          {errors.name && (
            <p className="text-red-500 text-[12px] mt-1.5">
              {errors.name.message}
            </p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="mb-1.5 text-[13px] text-[#84848A] font-medium"
          >
            Password
          </label>
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

        <div className="flex flex-col">
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 text-[13px] text-[#84848A] font-medium"
          >
            Confirm password
          </label>
          <div className="relative w-full">
            <input
              id="confirmPassword"
              placeholder="••••••••••"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={`bg-[#18181B] border pl-3.5 pr-10 focus:border-[#E3F05B] focus:ring-1 focus:ring-[#E3F05B] outline-none transition-all rounded-[8px] h-[44px] w-full text-white placeholder-[#52525B] text-[14px] font-medium ${errors.confirmPassword ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#27272A]"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525B] hover:text-white transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
              ) : (
                <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-[12px] mt-1.5">
              {errors.confirmPassword.message}
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
              <span>Create account</span>
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <div className="flex justify-center items-center mt-10 text-[#A1A1AA] text-[14px]">
        Already have an account?&nbsp;
        <Link
          to="/login"
          className="text-[#E3F05B] hover:text-[#f4ffa3] font-semibold transition-colors cursor-pointer"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default AccountCreationPage;
