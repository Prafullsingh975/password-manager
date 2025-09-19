import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

const PasswordModal: React.FC<{ entry: PasswordEntry | null; onSave: (entry: PasswordEntry) => void; onClose: () => void; }> = ({ entry, onSave, onClose }) => {
    const [website, setWebsite] = useState(entry?.website || '');
    const [username, setUsername] = useState(entry?.username || '');
    const [password, setPassword] = useState(entry?.password || '');
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave({ id: entry?.id || '', website, username, password });
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let newPassword = "";
        for (let i = 0; i < 16; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
        toast('Generated a new password!', { icon: '🎲' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-slate-700">
                 <h2 className="text-2xl font-bold mb-6">{entry ? 'Edit Password' : 'Add New Password'}</h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Website or Service</label>
                        <input type="text" value={website} onChange={e => setWebsite(e.target.value)} required className="w-full mt-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300">Username or Email</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full mt-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <div className="relative">
                            <input type="text" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md"/>
                        </div>
                        <button type="button" onClick={generatePassword} className="text-xs text-cyan-400 hover:text-cyan-300 mt-2">Generate Secure Password</button>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md">Save</button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default PasswordModal