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
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
      }
      setApiMessage({ type: "success", text: "Account created successfully!" });
      reset();
      // TODO: Handle routing to Dashboard
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          // Display backend errors as a unified banner message
          const validationErrors: Record<string, string[]> =
            error.response.data.errors || {};
          const firstErrorKey = Object.keys(validationErrors)[0];
          const errorMessage = firstErrorKey
            ? validationErrors[firstErrorKey][0]
            : error.response.data.message || "Account creation failed.";

          setApiMessage({ type: "error", text: errorMessage });
        } else {
          setApiMessage({
            type: "error",
            text:
              error.response.data.message ||
              "Account creation failed. Please try again.",
          });
        }
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
        <h2 className="text-[24px] font-bold text-white tracking-tight">
          Create your account
        </h2>
        <p className="text-[14px] text-[#A1A1AA]">
          Sign up to start tracking your applications
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-1.5 text-[13px] text-[#D4D4D8] font-medium"
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
            className="mb-1.5 text-[13px] text-[#D4D4D8] font-medium"
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
            className="mb-1.5 text-[13px] text-[#D4D4D8] font-medium"
          >
            Password
          </label>
          <div className="relative w-full">
            <input
              id="password"
              placeholder="••••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...passwordRegister}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={(e) => {
                passwordRegister.onBlur(e);
                setIsPasswordFocused(false);
              }}
              className={`bg-[#18181B] border pl-3.5 pr-10 focus:border-[#E3F05B] focus:ring-1 focus:ring-[#E3F05B] outline-none transition-all rounded-[8px] h-[44px] w-full text-white placeholder-[#52525B] text-[14px] font-medium ${errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#27272A]"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525B] hover:text-white transition-colors"
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

        <div className="flex flex-col">
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 text-[13px] text-[#D4D4D8] font-medium"
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
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525B] hover:text-white transition-colors"
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
          className="bg-[#E3F05B] text-black text-[15px] font-semibold rounded-[8px] h-[44px] w-full hover:bg-[#D3E04F] disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-1 flex flex-row items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin" />
          ) : (
            <>
              <span>Get Started</span>
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>
      <div className="flex justify-center items-center mt-12 md:mt-8 md:mb-12 text-[#A1A1AA] text-[14px]">
        Already have an account?&nbsp;
        <Link
          to="/login"
          className="text-[#E3F05B] hover:text-[#f4ffa3] font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default AccountCreationPage;
