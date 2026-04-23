import type { AnalyticsResponse, OverviewResponse } from '../types/metrics';
import type { Application, PaginatedApplications } from '../types/application';

const BASE_URL = 'https://jobtracker-api.afuwapetunde.com/api';

const getHeaders = () => {
    const token = localStorage.getItem('token'); 
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const api = {
    getAnalytics: async (): Promise<AnalyticsResponse> => {
        const response = await fetch(`${BASE_URL}/analytics`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    },

    getApplications: async (page = 1, perPage = 10, search?: string, status?: string): Promise<PaginatedApplications> => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
            ...(search && { search }),
            ...(status && { status }),
        });
        
        const response = await fetch(`${BASE_URL}/applications?${params}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch applications');
        return response.json();
    },

    createApplication: async (data: Partial<Application>): Promise<{ message: string, data: Application }> => {
        const response = await fetch(`${BASE_URL}/applications`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create application');
        return response.json();
    },

    updateApplication: async (id: number, data: Partial<Application>): Promise<{ message: string, data: Application }> => {
        const response = await fetch(`${BASE_URL}/applications/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update application');
        return response.json();
    },

    deleteApplication: async (id: number): Promise<void> => {
        const response = await fetch(`${BASE_URL}/applications/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete application');
    },

    getOverview: async (): Promise<OverviewResponse> => {
        const response = await fetch(`${BASE_URL}/overview`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch overview');
        return response.json();
    },
};