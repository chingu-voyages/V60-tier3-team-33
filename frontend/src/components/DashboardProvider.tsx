import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Application, ApplicationStatus } from '../types/application';
import type { AnalyticsResponse, InsightsResponse } from '../types/metrics';
import { api } from '../services/api';
import { authService } from '../api/auth';

type DashboardProviderTypes = {
    children: React.ReactNode;
}

import type { DashboardContextType, SavedLink, UploadedFile, UserProfile } from '../types/dashboard';

const DashboardContext = createContext<DashboardContextType | null>(null);

function DashboardProvider({children}: DashboardProviderTypes) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
      const cached = localStorage.getItem("user_profile");
      return cached ? JSON.parse(cached) : null;
    });
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [savedLinks, setSavedLinks] = useState<SavedLink[]>(() => {
      const stored = localStorage.getItem("saved_links");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse saved links", e);
        }
      }
      return [
        {
          id: 1,
          label: "LinkedIn Profile",
          url: "https://linkedin.com/in/yourusername",
        },
        { id: 2, label: "GitHub", url: "https://github.com/yourusername" },
        { id: 3, label: "X", url: "https://x.com/yourusername" },
        { id: 4, label: "Portfolio", url: "https://yourportfolio.com" },
      ];
    });

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
      const stored = localStorage.getItem("uploaded_files");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse uploaded files", e);
        }
      }
      return [];
    });

    useEffect(() => {
      localStorage.setItem("saved_links", JSON.stringify(savedLinks));
    }, [savedLinks]);

    useEffect(() => {
      localStorage.setItem("uploaded_files", JSON.stringify(uploadedFiles));
    }, [uploadedFiles]);

  const refreshProfile = useCallback(async () => {
    try {
      const profileResponse = await authService.getProfile();
      const userData = profileResponse?.data || profileResponse?.user || profileResponse;
      
      const cachedStr = localStorage.getItem("user_profile");
      const cachedProfile = cachedStr ? JSON.parse(cachedStr) : null;
      
      const profile: UserProfile = {
        fullName: userData.name || userData.fullName || "",
        email: userData.email || "",
        phoneNumber: userData.phone || userData.phoneNumber || userData.phone_number || cachedProfile?.phoneNumber || "",
        employmentStatus: userData.employment_status || userData.employmentStatus || cachedProfile?.employmentStatus || "Unemployed",
        notificationSettings: userData.notification_settings || userData.settings?.notification_settings || cachedProfile?.notificationSettings,
      };
      
      setUserProfile(profile);
      localStorage.setItem("user_profile", JSON.stringify(profile));
      
      // Support multiple possible keys for links and documents
      const links = userData.links || userData.user_links || userData.saved_links;
      if (Array.isArray(links)) {
        setSavedLinks(links.map((link: any) => ({
          id: link.id,
          label: link.label || link.name || link.title || "Link",
          url: link.url || link.link || link.href || ""
        })));
      }
      
      const docs = userData.documents || userData.user_documents || userData.files || userData.uploads;
      if (Array.isArray(docs)) {
        setUploadedFiles(docs.map((doc: any) => ({
          id: String(doc.id),
          name: doc.document || doc.name || doc.filename || doc.original_name || "Document",
          date: doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Recently"
        })));
      }
    } catch (err) {
      console.error("Profile refresh failed:", err);
    }
  }, []);

  const fetchData = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const [analyticsData, appsData, insightsData, profileResponse] = await Promise.allSettled([
        api.getAnalytics(),
        api.getApplications(1, 10),
        api.getInsights("thisMonth"),
        authService.getProfile(),
      ]);

      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);
      if (appsData.status === 'fulfilled') {
        setApplications(appsData.value.data);
        setPage(1);
        setHasMore(appsData.value.data.length === 10);
      }
      if (insightsData.status === 'fulfilled') setInsights(insightsData.value);
      
      if (profileResponse.status === 'fulfilled') {
        const userData = profileResponse.value?.data || profileResponse.value?.user || profileResponse.value;
        console.log("FULL PROFILE DATA FROM API:", JSON.stringify(userData, null, 2));
        
        // Retrieve cached profile to merge fields that the backend might drop
        const cachedStr = localStorage.getItem("user_profile");
        const cachedProfile = cachedStr ? JSON.parse(cachedStr) : null;
        
        const profile: UserProfile = {
          fullName: userData.name || userData.fullName || "",
          email: userData.email || "",
          phoneNumber: userData.phone || userData.phoneNumber || userData.phone_number || cachedProfile?.phoneNumber || "",
          employmentStatus: userData.employment_status || userData.employmentStatus || cachedProfile?.employmentStatus || "Unemployed",
          notificationSettings: userData.notification_settings || userData.settings?.notification_settings || cachedProfile?.notificationSettings,
        };
        
        setUserProfile(profile);
        localStorage.setItem("user_profile", JSON.stringify(profile));
        
        // Support multiple possible keys for links and documents
        const links = userData.links || userData.user_links || userData.saved_links;
        if (Array.isArray(links)) {
          setSavedLinks(links.map((link: any) => ({
            id: link.id,
            label: link.label || link.name || link.title || "Link",
            url: link.url || link.link || link.href || ""
          })));
        }
        
        const docs = userData.documents || userData.user_documents || userData.files || userData.uploads;
        console.log(`[DashboardProvider] Found ${Array.isArray(docs) ? docs.length : 0} documents in API response.`);
        if (Array.isArray(docs)) {
          setUploadedFiles(docs.map((doc: any) => ({
            id: String(doc.id),
            name: doc.document || doc.name || doc.filename || doc.original_name || "Document",
            date: doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Recently"
          })));
        }
      } else {
        console.error("Profile fetch failed:", profileResponse.reason);
        // Fallback to cached profile if available
        const cached = localStorage.getItem("user_profile");
        if (cached) {
          setUserProfile(JSON.parse(cached));
        }
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);
      
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMoreApplications = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.getApplications(nextPage, 10);
      
      setApplications(prev => {
        const existingIds = new Set(prev.map(app => app.id));
        const newApps = res.data.filter((app: Application) => !existingIds.has(app.id));
        return [...prev, ...newApps];
      });
      
      setPage(nextPage);
      setHasMore(res.data.length === 10);
      
    } catch (err) {
      console.error("Failed to load more applications", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore]);

  const saveApplication = async (data: Partial<Application>, id?: number) => {
    try {
      if (id) {
        await api.updateApplication(id, data);
      } else {
        await api.createApplication(data);
      }
      await fetchData(false);
    } catch (err) {
      console.error("Failed to save application", err);
      throw err;
    }
  };

  const deleteApplication = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
      await api.deleteApplication(id);
      await fetchData(false);
    } catch (err) {
      console.error("Failed to delete application", err);
      throw err;
    }
  };

  const changeApplicationStatus = async (id: number, status: ApplicationStatus) => {
    const previousApps = [...applications];
    
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status } : app)
    );

    try {
      await api.updateStatus(id, status);
      
    } catch (err) {
      console.error("Failed to update status", err);
      setApplications(previousApps);
    }
  };

  const addSavedLink = async (label: string, url: string) => {
    const tempId = Date.now();
    const newLink: SavedLink = { id: tempId, label, url };
    setSavedLinks((prev) => [...prev, newLink]);
    
    try {
      const response = await authService.addLink({ label, url });
      const backendLink = response?.link || response?.data || response;
      if (backendLink && backendLink.id) {
        setSavedLinks((prev) => prev.map(link => link.id === tempId ? { ...link, id: backendLink.id } : link));
      }
    } catch (err) {
      console.error("Failed to add link", err);
      setSavedLinks((prev) => prev.filter((link) => link.id !== tempId));
      throw err;
    }
  };

  const editSavedLink = async (id: number | string, label: string, url: string) => {
    const previousLinks = [...savedLinks];
    setSavedLinks((prev) => 
      prev.map(link => link.id === id ? { ...link, label, url } : link)
    );
    
    try {
      const response = await authService.editLink(id, { label, url });
      // Since the backend simulates edit by replacing the link, it returns a new ID.
      // We must patch the UI state with this new ID so future edits/deletes work.
      const backendLink = response?.link || response?.data || response;
      if (backendLink && backendLink.id) {
        setSavedLinks((prev) => 
          prev.map(link => link.id === id ? { ...link, id: backendLink.id } : link)
        );
      }
    } catch (err) {
      console.error("Failed to edit link", err);
      setSavedLinks(previousLinks);
      throw err;
    }
  };

  const removeSavedLink = async (id: number | string) => {
    const previousLinks = [...savedLinks];
    setSavedLinks((prev) => prev.filter((link) => link.id !== id));
    try {
      await authService.deleteLink(id);
    } catch (err: any) {
      console.error("Failed to delete link", err);
      // If it's a 404, it means it doesn't exist on the server (e.g., mock data or already deleted).
      // In this case, we don't revert the UI so it stays "deleted".
      if (err?.response?.status !== 404) {
        setSavedLinks(previousLinks);
      }
      throw err;
    }
  };

  const uploadNewDocument = async (file: File) => {
    const tempId = `temp-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const newDoc: UploadedFile = {
      id: tempId,
      name: file.name,
      date: dateStr,
    };
    
    setUploadedFiles((prev) => [...prev, newDoc]);
    
    try {
      const response = await authService.uploadDocument(file);
      const backendDoc = response?.document || response?.data || response;
      if (backendDoc && backendDoc.id) {
        setUploadedFiles((prev) => prev.map(doc => doc.id === tempId ? { ...doc, id: backendDoc.id } : doc));
      }
    } catch (err) {
      console.error("Failed to upload document", err);
      setUploadedFiles((prev) => prev.filter((doc) => doc.id !== tempId));
      throw err;
    }
  };

  const removeDocument = async (id: number | string) => {
    const previousDocs = [...uploadedFiles];
    setUploadedFiles((prev) => prev.filter((doc) => doc.id !== id));
    try {
      await authService.deleteDocument(id);
    } catch (err: any) {
      console.error("Failed to delete document", err);
      if (err?.response?.status !== 404) {
        setUploadedFiles(previousDocs);
      }
      throw err;
    }
  };

  const updateUserPersonalInfo = async (data: Partial<UserProfile>) => {
    try {
      await authService.updateProfile({
        name: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        employment_status: data.employmentStatus,
      });
      await refreshProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
      throw err;
    }
  };


  return (
    <DashboardContext.Provider 
      value={{ 
        applications, 
        setApplications,
        analytics, 
        insights, 
        userProfile,
        setUserProfile,
        isLoading, 
        savedLinks,
        setSavedLinks,
        uploadedFiles,
        setUploadedFiles,
        fetchData,
        saveApplication,
        deleteApplication,
        changeApplicationStatus,
        addSavedLink,
        editSavedLink,
        removeSavedLink,
        uploadNewDocument,
        removeDocument,
        updateUserPersonalInfo,
        page,
        hasMore,
        isLoadingMore,
        loadMoreApplications
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("requires DashboardProvider");
  }

  return context;
}

export default DashboardProvider;