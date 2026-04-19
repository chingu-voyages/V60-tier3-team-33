import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setApiMessage(null);
    console.log("Login data:", data);
    // Simulate backend API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    if (data.email === "error@test.com") {
      setApiMessage({ type: 'error', text: "Invalid email or password. Please try again." });
    } else {
      setApiMessage({ type: 'success', text: "Successfully logged in!" });
      reset();
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px] mx-auto flex flex-col justify-center h-full">
            <h2 className="text-[32px] md:text-[22px] lg:text-[24px] font-semibold text-[#4F4F4F] text-center mb-[101px] md:mb-8 lg:mb-10">
              Welcome Back
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="account-creation-form flex flex-col gap-6 md:gap-4 lg:gap-5"
            >
              <div className="form-group flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-[10px] md:mb-1.5 text-base md:text-[13px] lg:text-sm text-gray-700 font-medium"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="mscott@gmail.com"
                  {...register("email")}
                  className={`border px-6 md:px-4 lg:px-5 rounded-[15px] md:rounded-[10px] lg:rounded-xl h-[62px] md:h-[44px] lg:h-[50px] w-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all ${errors.email ? "border-red-500 focus:ring-red-200" : "border-black"}`}
                />
                {errors.email && (
                  <p className="error-message text-red-500 text-sm md:text-[11px] mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="form-group flex flex-col">
                <label
                  htmlFor="password"
                  className="mb-[10px] md:mb-1.5 text-base md:text-[13px] lg:text-sm text-gray-700 font-medium"
                >
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    id="password"
                    placeholder="*************"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`border pl-6 pr-12 md:pl-4 md:pr-10 lg:pl-5 lg:pr-12 rounded-[15px] md:rounded-[10px] lg:rounded-xl h-[62px] md:h-[44px] lg:h-[50px] w-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all ${errors.password ? "border-red-500 focus:ring-red-200" : "border-black"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 md:pr-3 lg:pr-4 flex items-center text-gray-500 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5" />
                    ) : (
                      <Eye className="w-6 h-6 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-message text-red-500 text-sm md:text-[11px] mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {apiMessage && (
                <div className={`p-4 md:p-3 rounded-xl md:rounded-lg text-sm md:text-xs lg:text-[13px] font-medium transition-all ${
                  apiMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                }`}>
                  {apiMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button bg-black text-white text-[16px] md:text-[13px] lg:text-sm font-medium rounded-[100px] h-[52px] md:h-[44px] lg:h-[48px] w-full hover:bg-gray-800 disabled:opacity-75 disabled:cursor-not-allowed transition-colors md:mt-2 flex flex-row items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 md:w-4 md:h-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
              
              <div className="flex justify-center mt-3 md:mt-1 lg:mt-2">
                <Link to="/forgot-password" className="text-sm md:text-xs lg:text-[13px] text-gray-500 hover:text-black font-medium transition-colors hover:underline">
                  Forgot password?
                </Link>
              </div>
            </form>
            <div className="flex flex-col items-center mt-[69px] md:mt-8 lg:mt-10 text-[#BDBDBD] gap-2 md:gap-1.5">
              <p className="text-[22px] md:text-[13px] lg:text-sm">Don't have an account?</p>
              <Link to="/register" className="text-[22px] md:text-[13px] lg:text-sm underline text-black font-medium">
                Create Account
              </Link>
            </div>
    </div>
  );
};

export default LoginPage;
