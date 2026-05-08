import { useState } from 'react';
import type { Application, ApplicationStatus } from '../types/application';
import Dropdown from './Dropdown';

interface ApplicationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Application>) => void;
    mode: 'add' | 'edit';
    initialData?: Application | null;
}

interface FormDataState {
    company_name?: string;
    role?: string;
    applied_at?: string;
    status?: string;
    location?: string;
    salary_min?: string | number;
    salary_max?: string | number;
    notes?: string;
    url?: string;
    jobNature?: string;
    workType?: string;
    noSalaryRange?: boolean;
    [key: string]: string | number | boolean | undefined;
}

const mapInitialData = (mode: 'add' | 'edit', data?: Application | null): FormDataState => {
    if (mode === 'edit' && data) {
        return {
            company_name: data.company_name || '',
            role: data.role || '',
            applied_at: data.applied_at || '',
            status: data.status || 'applied',
            location: data.location || '',
            salary_min: data.salary_min || '',
            salary_max: data.salary_max || '',
            notes: data.notes || '',
            url: typeof data.extras?.url === 'string' ? data.extras.url : '',
            jobNature: typeof data.extras?.jobNature === 'string' ? data.extras.jobNature : 'Full-time',
            workType: typeof data.extras?.workType === 'string' ? data.extras.workType : 'On-site',
            noSalaryRange: typeof data.extras?.noSalaryRange === 'boolean' ? data.extras.noSalaryRange : false,
        };
    }
    return {
        status: 'applied',
        jobNature: 'Full-time',
        workType: 'On-site',
        noSalaryRange: false,
        applied_at: new Date().toISOString().split('T')[0]
    };
};

export const ApplicationFormModal = ({ isOpen, onClose, onSave, mode, initialData }: ApplicationFormModalProps) => {
    
    const [formData, setFormData] = useState<FormDataState>(() => mapInitialData(mode, initialData));
    const [hasSubmitted, setHasSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (!formData.company_name || !formData.role || !formData.applied_at) {
            return; 
        }
        
        const payload: Partial<Application> = {
            company_name: formData.company_name,
            role: formData.role,
            applied_at: formData.applied_at,
            status: formData.status as ApplicationStatus,
            location: formData.location,
            notes: formData.notes,
            ...(formData.salary_min && { salary_min: Number(formData.salary_min) }),
            ...(formData.salary_max && { salary_max: Number(formData.salary_max) }),
            extras: {
                url: formData.url,
                jobNature: formData.jobNature as 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship' | undefined,
                workType: formData.workType as 'On-site' | 'Hybrid' | 'Remote' | undefined,
                noSalaryRange: Boolean(formData.noSalaryRange)
            }
        };

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-[#151617] border border-gray-200 dark:border-[#1E1F20] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-[#1E1F20]">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {mode === 'add' ? 'Add Application' : 'Edit Application'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="app-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                        
                        <div>
                            <label className="block text-sm text-gray-500 dark:text-[#A1A1AA] mb-1.5">Job Listing URL</label>
                            <input type="url" name="url" value={formData.url || ''} onChange={handleChange} placeholder="https://company.com/jobs/123" className="w-full bg-gray-50 dark:bg-[#181A1B] border border-gray-200 dark:border-[#222324] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-[#D4FA31] transition-colors" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm mb-1.5 ${hasSubmitted && !formData.company_name ? 'text-red-500' : 'text-gray-500 dark:text-[#A1A1AA]'}`}>Company *</label>
                                <input 
                                    required 
                                    type="text" 
                                    name="company_name" 
                                    value={formData.company_name || ''} 
                                    onChange={handleChange} 
                                    placeholder="Stripe" 
                                    className={`w-full bg-gray-50 dark:bg-[#181A1B] border rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                                        hasSubmitted && !formData.company_name 
                                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 ring-1 ring-red-500' 
                                        : 'border-gray-200 dark:border-[#222324] focus:border-indigo-500 dark:focus:border-[#D4FA31]'
                                    }`} 
                                />
                                {hasSubmitted && !formData.company_name && <p className="text-red-500 text-xs mt-1.5">Company is required</p>}
                            </div>
                            <div>
                                <label className={`block text-sm mb-1.5 ${hasSubmitted && !formData.role ? 'text-red-500' : 'text-gray-500 dark:text-[#A1A1AA]'}`}>Job Title *</label>
                                <input 
                                    required 
                                    type="text" 
                                    name="role" 
                                    value={formData.role || ''} 
                                    onChange={handleChange} 
                                    placeholder="Frontend Engineer" 
                                    className={`w-full bg-gray-50 dark:bg-[#181A1B] border rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                                        hasSubmitted && !formData.role 
                                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 ring-1 ring-red-500' 
                                        : 'border-gray-200 dark:border-[#222324] focus:border-indigo-500 dark:focus:border-[#D4FA31]'
                                    }`} 
                                />
                                {hasSubmitted && !formData.role && <p className="text-red-500 text-xs mt-1.5">Job title is required</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm mb-1.5 ${hasSubmitted && !formData.applied_at ? 'text-red-500' : 'text-gray-500 dark:text-[#A1A1AA]'}`}>Application Date *</label>
                                <input 
                                    required 
                                    type="date" 
                                    name="applied_at" 
                                    value={formData.applied_at || ''} 
                                    onChange={handleChange} 
                                    className={`w-full bg-gray-50 dark:bg-[#181A1B] border rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none transition-colors dark:scheme-dark ${
                                        hasSubmitted && !formData.applied_at 
                                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 ring-1 ring-red-500' 
                                        : 'border-gray-200 dark:border-[#222324] focus:border-indigo-500 dark:focus:border-[#D4FA31]'
                                    }`} 
                                />
                                {hasSubmitted && !formData.applied_at && <p className="text-red-500 text-xs mt-1.5">Date is required</p>}
                            </div>
                            <div>
                                <Dropdown
                                    label="Status"
                                    options={[
                                        { label: 'Applied', value: 'applied' },
                                        { label: 'Screening', value: 'screening' },
                                        { label: 'Interviewing', value: 'interviewing' },
                                        { label: 'Offer Received', value: 'offer_received' },
                                        { label: 'Accepted', value: 'accepted' },
                                        { label: 'Rejected', value: 'rejected' },
                                        { label: 'Withdrawn', value: 'withdrawn' }
                                    ]}
                                    value={formData.status || 'applied'}
                                    onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Dropdown
                                    label="Job Nature"
                                    options={['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']}
                                    value={formData.jobNature || 'Full-time'}
                                    onChange={(val) => setFormData(prev => ({ ...prev, jobNature: val }))}
                                />
                            </div>
                            <div>
                                <Dropdown
                                    label="Work Type"
                                    options={['On-site', 'Hybrid', 'Remote']}
                                    value={formData.workType || 'On-site'}
                                    onChange={(val) => setFormData(prev => ({ ...prev, workType: val }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 dark:text-[#A1A1AA] mb-1.5">Location</label>
                            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="San Francisco, CA" className="w-full bg-gray-50 dark:bg-[#181A1B] border border-gray-200 dark:border-[#222324] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-[#D4FA31] transition-colors" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <label className="block text-sm text-gray-500 dark:text-[#A1A1AA]">Salary Range</label>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-white mb-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    name="noSalaryRange" 
                                    checked={formData.noSalaryRange || false} 
                                    onChange={handleChange} 
                                    className="sr-only" 
                                />
                                
                                <div className={`w-4 h-4 flex items-center justify-center rounded border-[1.5px] transition-colors
                                    ${formData.noSalaryRange 
                                        ? 'bg-indigo-600 border-indigo-600 dark:bg-[#D4FA31] dark:border-[#D4FA31]' 
                                        : 'bg-transparent border-gray-400 dark:border-[#52525B] group-hover:border-indigo-500 dark:group-hover:border-[#D4FA31]'
                                    }`}
                                >
                                    {formData.noSalaryRange && (
                                        <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                
                                No range given
                            </label>
                            
                            {!formData.noSalaryRange && (
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" name="salary_min" value={formData.salary_min || ''} onChange={handleChange} placeholder="Min (e.g. 120000)" className="w-full bg-gray-50 dark:bg-[#181A1B] border border-gray-200 dark:border-[#222324] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-[#D4FA31] transition-colors" />
                                    <input type="number" name="salary_max" value={formData.salary_max || ''} onChange={handleChange} placeholder="Max (e.g. 160000)" className="w-full bg-gray-50 dark:bg-[#181A1B] border border-gray-200 dark:border-[#222324] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-[#D4FA31] transition-colors" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 dark:text-[#A1A1AA] mb-1.5">Notes</label>
                            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Any additional notes..." rows={3} className="w-full bg-gray-50 dark:bg-[#181A1B] border border-gray-200 dark:border-[#222324] rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-[#D4FA31] transition-colors resize-none"></textarea>
                        </div>

                    </form>
                </div>

               <div className="p-6 border-t border-gray-200 dark:border-[#1E1F20] flex items-center gap-4 bg-white dark:bg-[#151617] mt-auto">
                    <button type="submit" form="app-form" className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-[#EEFF2B] dark:hover:bg-[#D4FA31] text-white dark:text-black text-sm font-semibold py-3 px-8 rounded-xl transition-all active:scale-95 cursor-pointer">
                        {mode === 'add' ? 'Add Application' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={onClose} className="text-gray-500 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#222324] hover:bg-gray-50 dark:hover:bg-[#1E1F20] text-sm font-medium py-3 px-6 rounded-xl transition-all active:scale-95 cursor-pointer">
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};