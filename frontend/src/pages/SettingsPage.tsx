import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Upload,
  Link,
  Trash2,
  Loader2,
  Check,
  FileText,
  ChevronDown,
} from "lucide-react";
import { authService } from "../api/auth";
import { useDashboard } from "../components/DashboardProvider";

// --- SCHEMAS ---

const accountSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  employmentStatus: z.string().optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const socialLinksSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Must be a valid URL"),
});

type Tab = "Account" | "Notifications" | "Documents";

// --- HELPERS ---

const getInputClass = (hasError: boolean) => {
  return `w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg-app)] dark:bg-[#1A1A1A] border transition-all duration-200 shadow-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-[var(--border-color)] focus:border-[#9B6DFF] focus:ring-2 focus:ring-[#9B6DFF]/20 dark:focus:border-[#F2FF53] dark:focus:ring-[#F2FF53]/20"
  }`;
};

const labelClass = "block text-xs font-medium text-[var(--text-muted)] mb-1.5";
const sectionTitleClass =
  "text-sm font-semibold text-gray-900 dark:text-white mb-1";
const sectionSubtitleClass = "text-xs text-gray-500 dark:text-gray-400 mb-5";

// --- COMPONENTS ---

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Account");

  return (
    <div className="font-inter min-h-screen bg-(--bg-app) text-(--text-main)">
      <div className="max-w-3xl p-8 md:p-12">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-(--text-main)">
          Settings
        </h1>

        {/* Tabs */}
        <div className="mb-10 flex w-fit rounded-[16px] border border-(--border-color) bg-(--bg-surface) p-1">
          {(["Account", "Notifications", "Documents"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer rounded-[12px] border px-8 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "border-(--border-color) bg-(--chart-cursor) text-(--text-main) shadow-md"
                  : "border-transparent text-(--text-muted) hover:text-(--text-main)"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "Account" && <AccountTab />}
          {activeTab === "Notifications" && <NotificationsTab />}
          {activeTab === "Documents" && <DocumentsTab />}
        </div>
      </div>
    </div>
  );
};

const AccountTab: React.FC = () => {
  const [showPwd, setShowPwd] = useState({ current: false, new: false });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register: registerAccount,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(accountSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      employmentStatus: "Unemployed",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        const userData = response.user || response;
        reset({
          fullName: userData.name || "",
          email: userData.email || "",
          phoneNumber: userData.phone_number || "",
          employmentStatus: userData.employment_status || "Unemployed",
        });
      } catch (error) {
        console.error(
          "Failed to fetch profile. Falling back to mock data.",
          error,
        );
        // Fallback to mock data since backend profile endpoint is missing
        reset({
          fullName: "Alex Johnson",
          email: "alex@example.com",
          phoneNumber: "+1 (555) 000-0000",
          employmentStatus: "Unemployed",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
  } = useForm({
    resolver: zodResolver(securitySchema),
    mode: "onChange",
  });

  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false);
  const [isSuccessAccount, setIsSuccessAccount] = useState(false);

  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false);
  const [isSuccessSecurity, setIsSuccessSecurity] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const employmentStatus = watch("employmentStatus");

  const options = [
    "Currently employed",
    "Unemployed",
    "Student",
    "Freelancer",
    "Other",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onAccountSubmit = async (data: any) => {
    setIsSubmittingAccount(true);
    try {
      await authService.updateProfile({
        name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
        employment_status: data.employmentStatus,
      });
      setIsSuccessAccount(true);
      setTimeout(() => setIsSuccessAccount(false), 2000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSubmittingAccount(false);
    }
  };

  const onSecuritySubmit = async (_data: any) => {
    setIsSubmittingSecurity(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmittingSecurity(false);
    setIsSuccessSecurity(true);
    setTimeout(() => setIsSuccessSecurity(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Profile Information */}
      <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h2 className={sectionTitleClass}>Profile Information</h2>
        <p className={sectionSubtitleClass}>
          Update your personal details here.
        </p>

        {isLoadingProfile ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
          </div>
        ) : (
          <form
            onSubmit={handleAccountSubmit(onAccountSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  {...registerAccount("fullName")}
                  className={getInputClass(!!accountErrors.fullName)}
                />
                {accountErrors.fullName && (
                  <p className="mt-1.5 text-[12px] text-red-500">
                    {accountErrors.fullName.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email address</label>
                <input
                  {...registerAccount("email")}
                  className={getInputClass(!!accountErrors.email)}
                />
                {accountErrors.email && (
                  <p className="mt-1.5 text-[12px] text-red-500">
                    {accountErrors.email.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  {...registerAccount("phoneNumber")}
                  className={getInputClass(!!accountErrors.phoneNumber)}
                />
              </div>

              <div>
                <label className={labelClass}>Employment Status</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`${getInputClass(
                      !!accountErrors.employmentStatus,
                    )} flex cursor-pointer items-center justify-between text-left`}
                  >
                    <span
                      className={
                        employmentStatus ? "" : "text-[var(--text-muted)]"
                      }
                    >
                      {employmentStatus || "Select Status"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[var(--text-muted)] transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="animate-in fade-in zoom-in-95 absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl duration-200">
                      {options.map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            setValue("employmentStatus", option, {
                              shouldValidate: true,
                            });
                            setIsDropdownOpen(false);
                          }}
                          className={`cursor-pointer px-4 py-2.5 text-sm transition-colors hover:bg-[#9B6DFF]/10 hover:text-[#9B6DFF] dark:hover:bg-[#F2FF53]/10 dark:hover:text-[#F2FF53] ${
                            employmentStatus === option
                              ? "bg-[#9B6DFF]/5 font-medium text-[#9B6DFF] dark:bg-[#F2FF53]/5 dark:text-[#F2FF53]"
                              : "text-[var(--text-main)]"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAccount || isSuccessAccount}
              className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                isSuccessAccount
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-[#D6D3FF] text-[#111111] hover:bg-[#C4C0FF] focus:ring-2 focus:ring-[#9B6DFF]/50 focus:outline-none dark:bg-[#F2FF53] dark:text-[#111111] dark:hover:bg-[#EEFF2B]"
              }`}
            >
              {isSubmittingAccount ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : isSuccessAccount ? (
                <>
                  <Check className="h-[18px] w-[18px]" strokeWidth={2.5} />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        )}
      </div>

      {/* Security */}
      <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h2 className={sectionTitleClass}>Security</h2>
        <p className={sectionSubtitleClass}>
          Manage your password and security preferences.
        </p>

        <form
          onSubmit={handleSecuritySubmit(onSecuritySubmit)}
          className="max-w-md space-y-6"
        >
          {(
            [
              {
                id: "currentPassword",
                label: "Current Password",
                key: "current",
              },
              { id: "newPassword", label: "New Password", key: "new" },
            ] as const
          ).map((field) => (
            <div key={field.id}>
              <label className={labelClass}>{field.label}</label>
              <div className="relative">
                <input
                  type={
                    showPwd[field.key as keyof typeof showPwd]
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••••"
                  {...registerSecurity(field.id)}
                  className={getInputClass(
                    !!securityErrors[field.id as keyof typeof securityErrors],
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPwd((p) => ({
                      ...p,
                      [field.key]: !p[field.key as keyof typeof showPwd],
                    }))
                  }
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)]"
                >
                  {showPwd[field.key as keyof typeof showPwd] ? (
                    <EyeOff size={18} strokeWidth={2} />
                  ) : (
                    <Eye size={18} strokeWidth={2} />
                  )}
                </button>
              </div>
              {securityErrors[field.id as keyof typeof securityErrors] && (
                <p className="mt-1.5 text-[12px] text-red-500">
                  {
                    securityErrors[field.id as keyof typeof securityErrors]
                      ?.message as string
                  }
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmittingSecurity || isSuccessSecurity}
            className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
              isSuccessSecurity
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-transaprent border border-gray-300 text-[#111111] hover:bg-[#9CA3AF]/20 focus:ring-2 focus:ring-[#9B6DFF]/50 focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-gray-500/5"
            }`}
          >
            {isSubmittingSecurity ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            ) : isSuccessSecurity ? (
              <>
                <Check className="h-[18px] w-[18px]" strokeWidth={2.5} />
                Updated!
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const NotificationsTab: React.FC = () => {
  const [settings, setSettings] = useState({
    appReminders: { push: true, email: false },
    interviewReminders: { push: true, email: true },
    weeklySummary: { push: true, email: true },
  });

  const toggleSetting = (
    rowId: keyof typeof settings,
    type: "push" | "email",
  ) => {
    setSettings((s) => ({
      ...s,
      [rowId]: {
        ...s[rowId],
        [type]: !s[rowId][type],
      },
    }));
  };

  return (
    <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] py-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-8 pb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
        <div>
          <h2 className="">Notifications</h2>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex w-11 justify-center">
            <span>Push</span>
          </div>
          <div className="flex w-11 justify-center">
            <span>Email</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {(
          [
            {
              id: "appReminders",
              label: "Application Reminders",
              desc: "Get reminded to follow up on applications with no updates",
            },
            {
              id: "interviewReminders",
              label: "Interview Reminders",
              desc: "Reminders before scheduled interviews",
            },
            {
              id: "weeklySummary",
              label: "Weekly Summary",
              desc: "A weekly digest of your application activity",
            },
          ] as const
        ).map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between border-b border-[var(--border-color)] px-8 py-4 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                {row.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {row.desc}
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="flex w-11 justify-center">
                <button
                  onClick={() =>
                    toggleSetting(row.id as keyof typeof settings, "push")
                  }
                  aria-pressed={settings[row.id as keyof typeof settings].push}
                  className={`relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] focus:outline-none ${
                    settings[row.id as keyof typeof settings].push
                      ? "bg-[#606060] focus:ring-[#9B6DFF]/50 dark:bg-[#606060] dark:focus:ring-[#606060]/50"
                      : "bg-[#3A3A3A] focus:ring-gray-400/50 dark:bg-[#2A2A2A] dark:focus:ring-gray-600/50"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-md ring-0 transition-all duration-300 ease-in-out ${
                      settings[row.id as keyof typeof settings].push
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex w-11 justify-center">
                <button
                  onClick={() =>
                    toggleSetting(row.id as keyof typeof settings, "email")
                  }
                  aria-pressed={settings[row.id as keyof typeof settings].email}
                  className={`relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] focus:outline-none ${
                    settings[row.id as keyof typeof settings].email
                      ? "bg-[#606060] focus:ring-[#9B6DFF]/50 dark:bg-[#606060] dark:focus:ring-[#606060]/50"
                      : "bg-[#3A3A3A] focus:ring-gray-400/50 dark:bg-[#2A2A2A] dark:focus:ring-gray-600/50"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-md ring-0 transition-all duration-300 ease-in-out ${
                      settings[row.id as keyof typeof settings].email
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocumentsTab: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(socialLinksSchema),
    mode: "onChange",
  });

  const { savedLinks, setSavedLinks } = useDashboard();

  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; date: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date()),
      };
      setUploadedFiles((prev) => [...prev, newFile]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onAddLink = (data: any) => {
    // Check for duplicates
    const isDuplicate = savedLinks.some(
      (link) => link.url.toLowerCase() === data.url.toLowerCase(),
    );

    if (isDuplicate) {
      alert("This link has already been saved.");
      return;
    }

    setSavedLinks([
      ...savedLinks,
      { id: Date.now(), label: data.label, url: data.url },
    ]);
    reset(); // Clear input fields after success
  };

  return (
    <div className="space-y-10">
      <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h2 className={sectionTitleClass}>Documents</h2>
        <p className={sectionSubtitleClass}>
          Upload resumes, cover letters, and other files
        </p>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-gray-50 p-12 text-center transition-all duration-200 hover:border-[#D6D3FF] hover:bg-[#D6D3FF]/10 dark:border-[#27272A] dark:bg-[#1A1A1A] dark:hover:border-[#F2FF53] dark:hover:bg-[#F2FF53]/10"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-gray-200 transition-all duration-200 group-hover:scale-110 group-hover:bg-[#D6D3FF]/30 dark:bg-[#222222] dark:group-hover:bg-[#F2FF53]/10">
            <Upload
              size={18}
              className="text-gray-500 transition-colors duration-200 group-hover:text-[#9B6DFF] dark:text-gray-400 dark:group-hover:text-[#F2FF53]"
            />
          </div>
          <div className={sectionTitleClass}>Upload a file</div>
          <div className={sectionSubtitleClass}>PDF, DOC, DOCX up to 10MB</div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="group flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-[#191A1A]"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg p-2">
                    <FileText size={16} className="text-(--text-muted)" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Uploaded {file.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-100 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:opacity-0">
                  <button
                    onClick={() =>
                      setUploadedFiles(
                        uploadedFiles.filter((f) => f.id !== file.id),
                      )
                    }
                    className="cursor-pointer p-1 text-(--text-muted) transition-colors hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h2 className={sectionTitleClass}>Saved Links</h2>
        <p className={sectionSubtitleClass}>
          Links appear in the sidebar — click to copy for quick pasting into job
          applications
        </p>

        <form
          onSubmit={handleSubmit(onAddLink)}
          className="mb-8 flex items-start gap-4"
        >
          <div className="flex-1">
            <input
              {...register("label")}
              placeholder="Label (e.g. LinkedIn)"
              className={getInputClass(!!errors.label)}
            />
            {errors.label && (
              <p className="mt-1.5 pl-2 text-[12px] text-red-500">
                {errors.label.message as string}
              </p>
            )}
          </div>
          <div className="flex-1">
            <input
              {...register("url")}
              placeholder="https://..."
              className={getInputClass(!!errors.url)}
            />
            {errors.url && (
              <p className="mt-1.5 pl-2 text-[12px] text-red-500">
                {errors.url.message as string}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#D6D3FF] px-6 py-3 text-sm font-semibold text-[#111111] transition-all duration-200 hover:bg-[#C4C0FF] focus:ring-2 focus:ring-[#9B6DFF]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#F2FF53] dark:text-[#111111] dark:hover:bg-[#EEFF2B]"
          >
            <span className="mb-0.5 text-lg leading-none">+</span> Add
          </button>
        </form>

        <div className="space-y-3">
          {savedLinks.map((link) => (
            <div
              key={link.id}
              className="group flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-[#191A1A]"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg p-2">
                  <Link size={16} className="text-(--text-muted)" />
                </div>
                <div>
                  <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {link.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {link.url}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-100 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:opacity-1">
                <button className="cursor-pointer rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-medium text-(--text-muted) transition-all hover:bg-(--chart-cursor) hover:text-(--text-main)">
                  Edit
                </button>
                <button
                  onClick={() =>
                    setSavedLinks(savedLinks.filter((l) => l.id !== link.id))
                  }
                  className="cursor-pointer p-1 text-(--text-muted) transition-colors hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
