import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  X,
} from "lucide-react";
import { authService } from "../api/auth";
import { useDashboard } from "../components/DashboardProvider";
import Dropdown from "../components/Dropdown";

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
  return `w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-[#1A1A1A] border transition-all duration-200 shadow-sm text-gray-900 dark:text-white placeholder:text-[var(--text-muted)] focus:outline-none ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 dark:border-[#2A2A2A] focus:border-[#9B6DFF] focus:ring-2 focus:ring-[#9B6DFF]/20 dark:focus:border-[#F2FF53] dark:focus:ring-[#F2FF53]/20"
  }`;
};

const labelClass = "block text-xs font-medium text-[var(--text-muted)] mb-1.5";
const sectionTitleClass =
  "text-sm font-semibold text-gray-900 dark:text-white mb-1";
const sectionSubtitleClass = "text-xs text-gray-500 dark:text-gray-400 mb-5";

// --- COMPONENTS ---

const SettingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "Account";
  const [activeTab, setActiveTab] = useState<Tab>(
    ["Account", "Notifications", "Documents"].includes(initialTab)
      ? initialTab
      : "Account"
  );

  // Scroll to hash target after tab renders
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      // Small delay to let the tab content render
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

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
  const {
    userProfile,
    setUserProfile,
    isLoading: isLoadingDashboard,
  } = useDashboard();

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
    defaultValues: userProfile || {
      fullName: "",
      email: "",
      phoneNumber: "",
      employmentStatus: "Unemployed",
    },
  });

  useEffect(() => {
    console.log("AccountTab useEffect: userProfile is", userProfile);
    if (userProfile) {
      reset(userProfile);
    }
  }, [userProfile, reset]);

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

  const employmentStatus = watch("employmentStatus");

  const options = [
    "Currently employed",
    "Unemployed",
    "Student",
    "Freelancer",
    "Other",
  ];

  const onAccountSubmit = async (data: any) => {
    setIsSubmittingAccount(true);
    
    // Optimistic Update: Update global state and persist to localStorage immediately
    const updatedProfile = {
      ...(userProfile || {}),
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      employmentStatus: data.employmentStatus,
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile));

    try {
      await authService.updateProfile({
        name: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        employment_status: data.employmentStatus,
      });

      setIsSuccessAccount(true);
      setTimeout(() => setIsSuccessAccount(false), 2000);
    } catch (error: any) {
      console.error("Failed to update profile", error);
      // We keep the optimistic update so the UI doesn't break, but notify the user
      alert("Note: Changes were saved locally, but failed to sync to the server. Please try again later.");
    } finally {
      setIsSubmittingAccount(false);
    }
  };

  const onSecuritySubmit = async (data: any) => {
    setIsSubmittingSecurity(true);
    try {
      await authService.updatePassword({
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.newPassword, // Usually required by Laravel
      });
      setIsSuccessSecurity(true);
      setTimeout(() => setIsSuccessSecurity(false), 2000);
    } catch (error: any) {
      console.error("Failed to update password", error);
      alert(error.response?.data?.message || "Failed to update password. Please check your current password.");
    } finally {
      setIsSubmittingSecurity(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Profile Information */}
      <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h2 className={sectionTitleClass}>Profile Information</h2>
        <p className={sectionSubtitleClass}>
          Update your personal details here.
        </p>

        {isLoadingDashboard && !userProfile ? (
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
                <Dropdown
                  label="Employment Status"
                  options={options}
                  value={employmentStatus || ""}
                  onChange={(val) => setValue("employmentStatus", val, { shouldValidate: true })}
                  error={accountErrors.employmentStatus?.message}
                />
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
          {/* Current Password */}
          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative">
              <input
                type={showPwd.current ? "text" : "password"}
                placeholder="••••••••••"
                autoComplete="off"
                {...registerSecurity("currentPassword")}
                className={getInputClass(!!securityErrors.currentPassword)}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPwd((p) => ({ ...p, current: !p.current }))
                }
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)]"
              >
                {showPwd.current ? (
                  <Eye size={18} strokeWidth={2} />
                ) : (
                  <EyeOff size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {securityErrors.currentPassword && (
              <p className="mt-1.5 text-[12px] text-red-500">
                {securityErrors.currentPassword.message as string}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showPwd.new ? "text" : "password"}
                placeholder="••••••••••"
                autoComplete="new-password"
                {...registerSecurity("newPassword")}
                className={getInputClass(!!securityErrors.newPassword)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => ({ ...p, new: !p.new }))}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)]"
              >
                {showPwd.new ? (
                  <Eye size={18} strokeWidth={2} />
                ) : (
                  <EyeOff size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {securityErrors.newPassword && (
              <p className="mt-1.5 text-[12px] text-red-500">
                {securityErrors.newPassword.message as string}
              </p>
            )}
          </div>

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
  const { userProfile, fetchData } = useDashboard();
  const [settings, setSettings] = useState(() => {
    const cached = localStorage.getItem("notification_settings");
    if (cached) return JSON.parse(cached);
    return {
      appReminders: { push: true, email: true },
      interviewReminders: { push: true, email: true },
      weeklySummary: { push: true, email: true },
    };
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("notification_settings", JSON.stringify(settings));
  }, [settings]);

  // Sync with global profile state on load (if server has data)
  useEffect(() => {
    if (userProfile?.notificationSettings) {
      const ns = userProfile.notificationSettings;
      const serverSettings = {
        appReminders: ns.application_reminders || { push: true, email: true },
        interviewReminders: ns.interview_reminders || { push: true, email: true },
        weeklySummary: ns.weekly_summary || { push: true, email: true },
      };
      setSettings(serverSettings);
      localStorage.setItem("notification_settings", JSON.stringify(serverSettings));
    }
  }, [userProfile]);

  const toggleSetting = async (
    rowId: keyof typeof settings,
    type: "push" | "email",
  ) => {
    if (!settings[rowId]) {
      console.error(`Settings for ${String(rowId)} not found`);
      return;
    }
    
    const newVal = !settings[rowId][type];
    const newSettings = {
      ...settings,
      [rowId]: { ...settings[rowId], [type]: newVal },
    };

    // Optimistically update UI
    setSettings(newSettings);

    try {
      // Map frontend keys to backend keys safely
      const payload = {
        notification_settings: {
          application_reminders: newSettings.appReminders || { push: true, email: true },
          interview_reminders: newSettings.interviewReminders || { push: true, email: true },
          weekly_summary: newSettings.weeklySummary || { push: true, email: true },
        },
      };

      console.log("Updating notifications with payload:", payload);
      await authService.updateNotifications(payload);
      console.log("Notification update successful");
      
      // Force a global data refresh to sync everything
      await fetchData(false);
    } catch (err: any) {
      console.error("CRITICAL: Notification update failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      // Revert on actual error
      setSettings(settings);

      alert(
        `Failed to save notification preference: ${err.response?.data?.message || JSON.stringify(err.response?.data) || err.message}`,
      );
    }
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
              {/* Push Toggle */}
              <div className="flex w-12 justify-center">
                <button
                  onClick={() =>
                    toggleSetting(row.id as keyof typeof settings, "push")
                  }
                  aria-pressed={settings[row.id as keyof typeof settings].push}
                  className={`group relative inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                    settings[row.id as keyof typeof settings].push
                      ? "bg-[#606060]"
                      : "bg-[#E5E7EB] dark:bg-[#27272A]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                      settings[row.id as keyof typeof settings].push
                        ? "translate-x-[22px]"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Email Toggle */}
              <div className="flex w-12 justify-center">
                <button
                  onClick={() =>
                    toggleSetting(row.id as keyof typeof settings, "email")
                  }
                  aria-pressed={settings[row.id as keyof typeof settings].email}
                  className={`group relative inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                    settings[row.id as keyof typeof settings].email
                      ? "bg-[#606060]"
                      : "bg-[#E5E7EB] dark:bg-[#27272A]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                      settings[row.id as keyof typeof settings].email
                        ? "translate-x-[22px]"
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

  const {
    savedLinks,
    uploadedFiles,
    uploadNewDocument,
    removeDocument,
    addSavedLink,
    editSavedLink,
    removeSavedLink,
  } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      setIsUploading(true);
      uploadNewDocument(file).catch(err => {
        alert("Upload Error: " + (err.message || JSON.stringify(err)));
      }).finally(() => {
        setIsUploading(false);
      });
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onAddLink = async (data: any) => {
    try {
      await addSavedLink(data.label, data.url);
      reset(); 
    } catch (err) {
      alert("Failed to save link. It might already exist.");
    }
  };

  const handleEditClick = (link: any) => {
    setEditingLinkId(link.id);
    setEditLabel(link.label);
    setEditUrl(link.url);
  };

  const handleEditSave = async () => {
    if (editingLinkId && editLabel && editUrl) {
      try {
        await editSavedLink(editingLinkId, editLabel, editUrl);
        setEditingLinkId(null);
      } catch (err) {
        alert("Failed to update link.");
      }
    }
  };

  const handleEditCancel = () => {
    setEditingLinkId(null);
    setEditLabel("");
    setEditUrl("");
  };

  return (
    <div className="space-y-10">
      <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h2 className={sectionTitleClass}>Documents</h2>
        <p className={sectionSubtitleClass}>
          Upload resumes, cover letters, and other files
        </p>

        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-gray-50 p-12 text-center transition-all duration-200 hover:border-[#D6D3FF] hover:bg-[#D6D3FF]/10 dark:border-[#27272A] dark:bg-[#1A1A1A] dark:hover:border-[#F2FF53] dark:hover:bg-[#F2FF53]/10 ${
            isUploading ? "cursor-wait opacity-50" : ""
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx"
            disabled={isUploading}
          />
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-gray-200 transition-all duration-200 group-hover:scale-110 group-hover:bg-[#D6D3FF]/30 dark:bg-[#222222] dark:group-hover:bg-[#F2FF53]/10">
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#9B6DFF] dark:text-[#F2FF53]" />
            ) : (
              <Upload
                size={18}
                className="text-gray-500 transition-colors duration-200 group-hover:text-[#9B6DFF] dark:text-gray-400 dark:group-hover:text-[#F2FF53]"
              />
            )}
          </div>
          <div className={sectionTitleClass}>
            {isUploading ? "Uploading..." : "Upload a file"}
          </div>
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
                    onClick={() => removeDocument(file.id)}
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

      <div id="saved-links-section" className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm scroll-mt-8">
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
              {editingLinkId === link.id ? (
                <div className="flex w-full items-center gap-3">
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1A1A1A] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-[var(--text-muted)] transition-colors focus:border-[#9B6DFF] focus:outline-none focus:ring-2 focus:ring-[#9B6DFF]/20 dark:focus:border-[#F2FF53] dark:focus:ring-[#F2FF53]/20"
                    placeholder="Label"
                  />
                  <input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1A1A1A] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-[var(--text-muted)] transition-colors focus:border-[#9B6DFF] focus:outline-none focus:ring-2 focus:ring-[#9B6DFF]/20 dark:focus:border-[#F2FF53] dark:focus:ring-[#F2FF53]/20"
                    placeholder="URL"
                  />
                  <button
                    onClick={handleEditSave}
                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#D6D3FF] px-4 py-3 text-[#111111] transition-all hover:bg-[#C4C0FF] dark:bg-[#F2FF53] dark:text-[#111111] dark:hover:bg-[#EEFF2B]"
                  >
                    <Check size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 transition-all hover:bg-red-100 dark:border-red-900/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <>
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
                    <button 
                      onClick={() => handleEditClick(link)}
                      className="cursor-pointer rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-medium text-(--text-muted) transition-all hover:bg-(--chart-cursor) hover:text-(--text-main)"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeSavedLink(link.id)}
                      className="cursor-pointer p-1 text-(--text-muted) transition-colors hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
