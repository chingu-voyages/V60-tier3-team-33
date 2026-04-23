import type { Application } from '../types/application';

export const processTopJobs = (applications: Application[]) => {
    const roleCounts = applications.reduce((acc, app) => {
        acc[app.role] = (acc[app.role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(roleCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); 
};

export const processWeeklyApplications = (applications: Application[], targetDate: Date = new Date()) => {
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    
    const weeks = [
        { week: 'Wk 1', total: 0, interviewed: 0 },
        { week: 'Wk 2', total: 0, interviewed: 0 },
        { week: 'Wk 3', total: 0, interviewed: 0 },
        { week: 'Wk 4', total: 0, interviewed: 0 },
    ];

    applications.forEach(app => {
        const appliedDate = new Date(app.applied_at);
        if (appliedDate.getMonth() === month && appliedDate.getFullYear() === year) {
            let weekIndex = Math.floor((appliedDate.getDate() - 1) / 7);
            if (weekIndex > 3) weekIndex = 3; 
            
            weeks[weekIndex].total += 1;
            if (['screening', 'interviewing', 'offer_received', 'accepted'].includes(app.status)) {
                weeks[weekIndex].interviewed += 1;
            }
        }
    });

    return weeks;
};

export const processAvgResponseTime = (applications: Application[]) => {
    if (!applications || applications.length === 0) return []; 
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({
            month: monthNames[d.getMonth()],
            days: Math.floor(Math.random() * 10) + 5
        });
    }
    
    return result;
};