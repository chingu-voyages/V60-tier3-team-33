import type { Application } from '../types/application';

interface ApplicationCardModalProps {
    isOpen: boolean;
    application: Application | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const ApplicationCardModal = ({ isOpen, application, onClose, onEdit, onDelete }: ApplicationCardModalProps) => {
    if (!isOpen || !application) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
                
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <span className="bg-gray-100 dark:bg-[#27272A] text-gray-900 dark:text-white px-3 py-1 rounded-md text-sm font-medium border border-gray-200 dark:border-[#3F3F46] capitalize">
                            {application.status.replace('_', ' ')}
                        </span>
                        <span className="text-gray-500 dark:text-[#A1A1AA] text-sm">{formatDate(application.applied_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-500 dark:text-[#A1A1AA]">
                        <button className="hover:text-gray-900 dark:hover:text-white transition-colors" title="Hide">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        </button>
                        <button onClick={onEdit} className="hover:text-gray-900 dark:hover:text-white transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={onDelete} className="hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <button onClick={onClose} className="hover:text-gray-900 dark:hover:text-white transition-colors ml-2" title="Close">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{application.role}</h1>
                    <p className="text-gray-500 dark:text-[#A1A1AA]">{application.company_name}</p>
                    {application.extras?.url && (
                        <a href={application.extras.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-[#D4FA31] text-sm hover:underline mt-2 inline-block">
                            View Job Listing ↗
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-[#A1A1AA] mb-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-xs uppercase tracking-wider font-semibold">Location</span>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm pl-6">
                            {application.location || 'Not specified'} 
                            {application.extras?.workType && ` (${application.extras.workType.toLowerCase()})`}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-[#A1A1AA] mb-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-xs uppercase tracking-wider font-semibold">Applied</span>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm pl-6">{formatDate(application.applied_at)}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-[#A1A1AA] mb-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="text-xs uppercase tracking-wider font-semibold">Job Type</span>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm pl-6">{application.extras?.jobNature || 'Not specified'}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-[#A1A1AA] mb-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-xs uppercase tracking-wider font-semibold">Salary</span>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm pl-6">
                            {application.extras?.noSalaryRange || (!application.salary_min && !application.salary_max) 
                                ? 'Not provided' 
                                : `$${application.salary_min || 0} – $${application.salary_max || '...'}`
                            }
                        </p>
                    </div>
                </div>

                {application.notes && (
                    <div className="mb-8 border-t border-gray-200 dark:border-[#27272A] pt-6">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#A1A1AA] font-semibold mb-2">Notes</h3>
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-[#121212] p-4 rounded-lg border border-gray-200 dark:border-[#27272A]">
                            {application.notes}
                        </p>
                    </div>
                )}

                <div className="border-t border-gray-200 dark:border-[#27272A] pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#A1A1AA] font-semibold">Tasks</h3>
                        <button className="text-indigo-600 dark:text-[#D4FA31] text-sm hover:text-indigo-500 dark:hover:text-[#e1f961] font-medium transition-colors">
                            + Add task
                        </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-[#A1A1AA] mb-2">Suggested</div>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#27272A] rounded-lg p-3">
                        <span className="text-gray-900 dark:text-white">+</span>
                        <div className="flex-1 text-gray-900 dark:text-white text-sm">Follow up with {application.company_name}</div>
                            <div className="flex gap-3">
                                <button className="text-indigo-600 dark:text-[#D4FA31] text-sm font-medium hover:text-indigo-500 dark:hover:text-[#e1f961] transition-colors active:scale-95">Accept</button>
                                <button className="text-gray-500 dark:text-[#A1A1AA] text-sm hover:text-gray-900 dark:hover:text-white transition-colors active:scale-95">Ignore</button>
                            </div>
                        </div>
                </div>

            </div>
        </div>
    );
};