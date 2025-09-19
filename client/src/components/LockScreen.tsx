import { KeyRound, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { decryptVault, encryptVault } from "../utils/helper";
import { api } from "../api/config";
import toast from "react-hot-toast";

const LockScreen: React.FC<{
    isNewUser: boolean;
    onUnlock: (masterPassword: string, decryptedData: PasswordEntry[]) => void;
}> = ({ isNewUser, onUnlock }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        passwordInputRef.current?.focus();
    }, []);

    const handleUnlock = () => {
        setError('');
        const encryptedVault = sessionStorage.getItem('encryptedVault');
        if (!encryptedVault) {
             setError('Session expired or vault not found. Please log in again.');
             return;
        }
        const decrypted = decryptVault(encryptedVault, password);
        if (decrypted) {
            onUnlock(password, decrypted);
            toast.success("Vault Unlocked!");
        } else {
            setError('Incorrect master password.');
            toast.error("Incorrect master password.");
        }
    };
    
    const handleCreate = async () => {
        setError('');
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        const emptyVault: PasswordEntry[] = [];
        const encrypted = encryptVault(emptyVault, password);
        try {
            await api.post('/vault', { data: encrypted });
            onUnlock(password, emptyVault);
            toast.success("Vault Created Successfully!");
        } catch (err) {
            setError('Failed to create vault on server.');
            toast.error('Failed to create vault on server.');
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isNewUser) handleCreate();
        else handleUnlock();
    };

    return (
        <div className="w-full max-w-sm p-8 space-y-6 bg-slate-800 rounded-lg shadow-2xl text-center border border-slate-700">
            <div className="flex flex-col items-center text-cyan-400">
                <ShieldCheck size={48} />
                <h1 className="text-2xl font-bold mt-4">{isNewUser ? 'Create Your Master Password' : 'Unlock Your Vault'}</h1>
            </div>
            <p className="text-slate-400 text-sm">{isNewUser ? 'This password encrypts your data and is the only key to your vault. Do not forget it.' : 'Enter your master password to decrypt your vault.'}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <input ref={passwordInputRef} type="password" placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                 {isNewUser && (
                     <input type="password" placeholder="Confirm Master Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                 )}
                 {error && <p className="text-red-400 text-sm">{error}</p>}
                 <button type="submit" className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors">
                    <KeyRound size={18}/>
                    {isNewUser ? 'Create Vault' : 'Unlock'}
                 </button>
            </form>
        </div>
    );
};


export default LockScreen