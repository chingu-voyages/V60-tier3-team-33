import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import LoginSvg from '../../assets/login.svg?url'; // Temporarily disabled while looking for a better illustration

// Define the schema for account creation
const accountCreationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
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
    { label: "Special character", met: /[^a-zA-Z0-9]/.test(password) }
  ];

  const strength = rules.filter(r => r.met).length;

  const [showPassword, setShowPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordRegister = register("password");

  const onSubmit = async (data: AccountCreationFormInputs) => {
    setApiMessage(null);
    console.log("Account creation data:", data);
    // Simulate backend API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    if (data.email === "error@test.com") {
      setApiMessage({ type: 'error', text: "Account creation failed. Email might already be in use." });
    } else {
      setApiMessage({ type: 'success', text: "Account created successfully!" });
      reset();
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px] mx-auto flex flex-col justify-center h-full">
            <h2 className="text-[32px] md:text-[22px] lg:text-[24px] font-semibold text-[#4F4F4F] text-center mb-[101px] md:mb-8 lg:mb-10">
              Create Account
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="account-creation-form flex flex-col gap-6 md:gap-4 lg:gap-5"
            >
              <div className="form-group flex flex-col">
                <label
                  htmlFor="firstName"
                  className="mb-[10px] md:mb-1.5 text-base md:text-[13px] lg:text-sm text-gray-700 font-medium"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Michael"
                  {...register("firstName")}
                  className={`border px-6 md:px-4 lg:px-5 rounded-[15px] md:rounded-[10px] lg:rounded-xl h-[62px] md:h-[44px] lg:h-[50px] w-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all ${errors.firstName ? "border-red-500 focus:ring-red-200" : "border-black"}`}
                />
                {errors.firstName && (
                  <p className="error-message text-red-500 text-sm md:text-[11px] mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

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
                    {...passwordRegister}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={(e) => {
                      passwordRegister.onBlur(e);
                      setIsPasswordFocused(false);
                    }}
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

                  {/* Responsive Floating Password Strength Popover */}
                  {isPasswordFocused && (
                    <div className="absolute md:top-1/2 md:-translate-y-1/2 md:left-[calc(100%+20px)] lg:left-[calc(100%+32px)] top-full left-0 mt-3 md:mt-0 w-full md:w-[240px] lg:w-[260px] z-[100] flex flex-col gap-2.5 bg-white p-3 lg:p-4 rounded-[12px] md:rounded-[14px] border border-gray-100 shadow-xl md:shadow-[0px_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
                      <div className="flex gap-1.5 h-2 md:h-1 lg:h-1.5 w-full">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-500 ${
                              strength > i
                                ? strength <= 2
                                  ? 'bg-red-400'
                                  : strength <= 4
                                  ? 'bg-yellow-400'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-2 mt-0.5">
                        {rules.map((rule, idx) => (
                          <div key={idx} className={`flex items-center gap-1.5 text-[14px] md:text-[10px] lg:text-[11px] xl:text-[12px] transition-colors duration-300 ${rule.met ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {rule.met ? <Check className="w-4 h-4 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5" /> : <X className="w-4 h-4 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 opacity-40" />}
                            <span>{rule.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {errors.password && !isPasswordFocused && (
                  <p className="error-message text-red-500 text-sm md:text-[11px] mt-1.5">
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
                className="submit-button bg-black text-white text-[16px] md:text-[13px] lg:text-sm font-medium rounded-[100px] h-[52px] md:h-[44px] lg:h-[48px] w-full hover:bg-gray-800 disabled:opacity-75 disabled:cursor-not-allowed transition-colors md:mt-1 xl:mt-2 flex flex-row items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 md:w-4 md:h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="flex flex-col items-center mt-[69px] md:mt-8 lg:mt-10 text-[#BDBDBD] gap-2 md:gap-1.5">
              <p className="text-[22px] md:text-[13px] lg:text-sm">Already have an account?</p>
              <Link to="/login" className="text-[22px] md:text-[13px] lg:text-sm underline text-black font-medium">
                Login
              </Link>
            </div>
    </div>
  );
};

export default AccountCreationPage;
