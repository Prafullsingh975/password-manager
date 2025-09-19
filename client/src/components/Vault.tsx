import { Lock, LogOut, PlusCircle, Search } from "lucide-react";
import PasswordListItem from "./PasswordListItem";
import PasswordModal from "./PasswordModal";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../hooks/useAuth";
import { encryptVault } from "../utils/helper";
import { api } from "../api/config";

const Vault: React.FC<{
    initialVault: PasswordEntry[];
    masterPassword: string;
    onLock: () => void;
}> = ({ initialVault, masterPassword, onLock }) => {
    const [passwords, setPasswords] = useState<PasswordEntry[]>(initialVault);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const saveVault = async () => {
            const encryptedData = encryptVault(passwords, masterPassword);
            try {
                await api.post('/vault', { data: encryptedData });
            } catch (err) {
                console.error("Failed to save vault", err);
                toast.error("Error: Could not sync changes with the server.");
            }
        };
        if (passwords !== initialVault) {
            saveVault();
        }
    }, [passwords, masterPassword, initialVault]);
    
    const handleSavePassword = (entry: PasswordEntry) => {
        if (editingPassword) {
            setPasswords(passwords.map(p => p.id === entry.id ? entry : p));
            toast.success("Entry updated!");
        } else {
            setPasswords([...passwords, { ...entry, id: new Date().toISOString() }]);
             toast.success("New entry added!");
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        // Using a custom confirm modal would be better than window.confirm
        if (window.confirm("Are you sure you want to delete this entry?")) {
            setPasswords(passwords.filter(p => p.id !== id));
            toast.success("Entry deleted.");
        }
    };
    
    const openModal = (entry: PasswordEntry | null = null) => {
        setEditingPassword(entry);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPassword(null);
    };

    const handleLogout = () => {
        logout();
        sessionStorage.removeItem('encryptedVault');
        toast.success("You've been logged out.");
        navigate('/');
    };
    
    const filteredPasswords = passwords.filter(p => 
        p.website.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        p.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-slate-100">My Vault</h1>
                    <div className="flex items-center space-x-2">
                        <button onClick={onLock} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors" title="Lock Vault"><Lock size={20}/></button>
                        <button onClick={handleLogout} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors" title="Logout"><LogOut size={20}/></button>
                        <button onClick={() => openModal()} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            <PlusCircle size={20}/> Add New
                        </button>
                    </div>
                </header>
                
                <div className="relative mb-8">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                     <input type="text" placeholder="Search by website or username..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"/>
                </div>

                <div className="space-y-4">
                    {filteredPasswords.map(p => (
                        <PasswordListItem key={p.id} entry={p} onEdit={() => openModal(p)} onDelete={() => handleDelete(p.id)} />
                    ))}
                </div>

                {passwords.length > 0 && filteredPasswords.length === 0 && <p className="text-center text-slate-400 mt-12">No matching passwords found.</p>}
                {passwords.length === 0 && (
                    <div className="text-center text-slate-400 mt-12">
                        <p className="text-lg">Your vault is empty.</p>
                        <p>Click "Add New" to get started.</p>
                    </div>
                )}
            </div>
            
            {isModalOpen && <PasswordModal entry={editingPassword} onSave={handleSavePassword} onClose={closeModal} />}
        </div>
    );
};

export default Vault;