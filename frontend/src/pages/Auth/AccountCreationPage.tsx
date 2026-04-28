import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { authService } from "../../api/auth";
import axios from "axios";

// Define the schema for account creation
const accountCreationSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AccountCreationFormInputs = z.infer<typeof accountCreationSchema>;

const AccountCreationPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountCreationFormInputs>({
    resolver: zodResolver(accountCreationSchema),
  });

  const password = watch("password", "");

  const rules = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const strength = rules.filter((r) => r.met).length;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordRegister = register("password");

  const onSubmit = async (data: AccountCreationFormInputs) => {
    setApiMessage(null);
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      if (response.access_token) {
        localStorage.setItem("auth_token", response.access_token);
      }
      setApiMessage({ type: "success", text: "Account created successfully!" });
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Account creation failed.";
        setApiMessage({ type: "error", text: errorMessage });
      } else {
        setApiMessage({
          type: "error",
          text: "An unexpected network error occurred.",
        });
      }
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-1 mb-8 text-left">
        <h2 className="text-[28px] font-bold text-white tracking-tight">
          Create your account
        </h2>
        <p className="text-[14px] text-[#9898A1]">
          Sign up to start tracking your applications
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            placeholder="Michael Scott"
            autoComplete="name"
            {...register("name")}
            className={`w-full px-4 py-3 rounded-xl text-sm bg-[#1A1A1A] border ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-[#2A2A2A] focus:ring-[#D4F03D]/50"
            } shadow-sm text-white placeholder-[#84848A] focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.name && (
            <p className="text-red-500 text-[12px] mt-1.5">
              {errors.name.message}
            </p>
          )}
        </div>

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

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Password
          </label>
          <div className="relative w-full">
            <input
              placeholder="••••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...passwordRegister}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={(e) => {
                passwordRegister.onBlur(e);
                setIsPasswordFocused(false);
              }}
              className={`w-full px-4 py-3 rounded-xl text-sm bg-[#1A1A1A] border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#2A2A2A] focus:ring-[#D4F03D]/50"
              } shadow-sm text-white placeholder-[#84848A] focus:outline-none focus:ring-2 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525B] hover:text-white hover:underline transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
              ) : (
                <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
              )}
            </button>

            {/* Dark Floating Password Strength Popover */}
            <AnimatePresence>
              {isPasswordFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[calc(100%+12px)] left-0 w-full z-100 flex flex-col gap-3 bg-[#1A1A1C] p-4 rounded-[12px] border border-[#2F2F32] shadow-2xl"
                >
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-500 ${
                          strength > i
                            ? strength <= 2
                              ? "bg-red-500"
                              : strength <= 4
                                ? "bg-orange-400"
                                : "bg-[#E3F05B]"
                            : "bg-[#27272A]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    {rules.map((rule, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-[12px] transition-colors duration-300 ${rule.met ? "text-[#E3F05B] font-medium" : "text-[#71717A]"}`}
                      >
                        {rule.met ? (
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        ) : (
                          <X
                            className="w-3.5 h-3.5 opacity-50"
                            strokeWidth={2}
                          />
                        )}
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {errors.password && !isPasswordFocused && (
            <p className="text-red-500 text-[12px] mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Confirm password
          </label>
          <div className="relative w-full">
            <input
              placeholder="••••••••••"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={`w-full px-4 py-3 rounded-xl text-sm bg-[#1A1A1A] border ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#2A2A2A] focus:ring-[#D4F03D]/50"
              } shadow-sm text-white placeholder-[#84848A] focus:outline-none focus:ring-2 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525B] hover:text-white hover:underline transition-colors cursor-pointer"
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
              Get Started
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>
      <div className="flex justify-center items-center mt-12 md:mt-8 text-[#9898A1] text-[14px]">
        Already have an account?&nbsp;
        <Link
          to="/login"
          className="text-[#E3F05B] hover:text-[#f4ffa3] hover:underline font-semibold hover:underline transition-colors cursor-pointer"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default AccountCreationPage;
