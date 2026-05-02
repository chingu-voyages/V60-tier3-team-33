import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Upload, Link, Trash2, Loader2, Check } from "lucide-react";

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
      : "border-[var(--border-color)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
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
              className={`rounded-[12px] border px-8 py-2.5 text-sm font-medium transition-all ${
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
    register: registerAccount,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "Alex Johnson",
      email: "alex@example.com",
      phoneNumber: "+1 (555) 000-0000",
      employmentStatus: "Unemployed",
    },
  });

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

  const onAccountSubmit = async (_data: any) => {
    setIsSubmittingAccount(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmittingAccount(false);
    setIsSuccessAccount(true);
    setTimeout(() => setIsSuccessAccount(false), 2000);
  };
  
  const onSecuritySubmit = async (_data: any) => {
    setIsSubmittingSecurity(true);
    await new Promise(resolve => setTimeout(resolve, 800));
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
              <input
                {...registerAccount("employmentStatus")}
                className={getInputClass(!!accountErrors.employmentStatus)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingAccount || isSuccessAccount}
            className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              isSuccessAccount 
                ? "bg-green-500 text-white hover:bg-green-600 dark:text-black" 
                : "bg-[var(--accent-primary)] text-white hover:opacity-90 dark:text-black disabled:opacity-70"
            }`}
          >
            {isSubmittingAccount ? (
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
            ) : isSuccessAccount ? (
              <>
                <Check className="w-[18px] h-[18px]" strokeWidth={2.5} />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
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
            className={`mt-2 flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all duration-300 hover:opacity-90 disabled:opacity-70 ${
              isSuccessSecurity 
                ? "border-green-500 bg-green-500 text-white hover:bg-green-600 dark:border-green-500 dark:bg-green-500 dark:text-black dark:hover:bg-green-600" 
                : "border-gray-400 bg-[var(--bg-surface)] text-black dark:border-[#222324] dark:bg-[#151617] dark:text-white dark:hover:bg-[#1E1F20]"
            }`}
          >
            {isSubmittingSecurity ? (
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
            ) : isSuccessSecurity ? (
              <>
                <Check className="w-[18px] h-[18px]" strokeWidth={2.5} />
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
    <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className={sectionTitleClass}>Notification Preferences</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose how you want to be notified.
          </p>
        </div>
        <div className="flex items-center gap-10 pr-4 text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">
          <span>Push</span>
          <span>Email</span>
        </div>
      </div>

      <div className="space-y-6">
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
            className="flex items-center justify-between border-b border-[var(--border-color)] pb-6 last:border-0 last:pb-0"
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
              <button
                onClick={() =>
                  toggleSetting(row.id as keyof typeof settings, "push")
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] focus:outline-none ${
                  settings[row.id as keyof typeof settings].push
                    ? "bg-[var(--accent-primary)]"
                    : "bg-[var(--chart-axis)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[row.id as keyof typeof settings].push
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>

              <button
                onClick={() =>
                  toggleSetting(row.id as keyof typeof settings, "email")
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] focus:outline-none ${
                  settings[row.id as keyof typeof settings].email
                    ? "bg-[var(--accent-primary)]"
                    : "bg-[var(--chart-axis)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[row.id as keyof typeof settings].email
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(socialLinksSchema),
    mode: "onChange",
  });

  const [savedLinks, setSavedLinks] = useState([
    {
      id: 1,
      label: "LinkedIn Profile",
      url: "https://linkedin.com/in/yourusername",
    },
    { id: 2, label: "GitHub", url: "https://github.com/yourusername" },
    { id: 3, label: "X", url: "https://x.com/yourusername" },
    { id: 4, label: "Portfolio", url: "https://yourportfolio.com" },
  ]);

  const onAddLink = (data: any) => {
    setSavedLinks([
      ...savedLinks,
      { id: Date.now(), label: data.label, url: data.url },
    ]);
  };

  return (
    <div className="space-y-10">
      <div className="rounded-[16px] border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h2 className={sectionTitleClass}>Documents</h2>
        <p className={sectionSubtitleClass}>
          Upload resumes, cover letters, and other files
        </p>

        <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-(--border-color) bg-(--bg-app) p-12 text-center transition-all hover:border-[#F2FF53] hover:bg-[#F2FF53]/20 dark:bg-[#1A1A1A] hover:dark:bg-[#F2FF53]/5">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-gray-400 transition-transform group-hover:scale-110 dark:bg-[#1A1A1A]">
            <Upload
              size={18}
              className="text-gray-900 transition-colors group-hover:text-black dark:text-white"
            />
          </div>
          <div className={sectionTitleClass}>Upload a file</div>
          <div className={sectionSubtitleClass}>PDF, DOC, DOCX up to 10MB</div>
        </div>
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
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-(--accent-primary) px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:text-black"
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
              <div className="flex items-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-medium text-(--text-muted) transition-all hover:bg-(--chart-cursor) hover:text-(--text-main)">
                  Edit
                </button>
                <button
                  onClick={() =>
                    setSavedLinks(savedLinks.filter((l) => l.id !== link.id))
                  }
                  className="p-1 text-(--text-muted) transition-colors hover:text-red-400"
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
