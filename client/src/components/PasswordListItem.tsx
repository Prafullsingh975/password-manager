import { Copy, Edit, Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const PasswordListItem: React.FC<{ entry: PasswordEntry; onEdit: () => void; onDelete: () => void; }> = ({ entry, onEdit, onDelete }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${field} copied to clipboard!`);
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-700 hover:border-cyan-500 transition-colors">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="bg-slate-700 p-3 rounded-md">
                     <KeyRound className="text-cyan-400"/>
                </div>
                <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-lg truncate text-slate-200">{entry.website}</h3>
                    <div className="flex items-center gap-2">
                         <p className="text-slate-400 truncate text-sm">{entry.username}</p>
                         <button onClick={() => copyToClipboard(entry.username, 'Username')} className="text-slate-500 hover:text-white"><Copy size={14}/></button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-400 truncate text-sm">{isVisible ? entry.password : '••••••••••••'}</p>
                        <button onClick={() => setIsVisible(!isVisible)} className="text-slate-500 hover:text-white">{isVisible ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
                        <button onClick={() => copyToClipboard(entry.password, 'Password')} className="text-slate-500 hover:text-white"><Copy size={14}/></button>
                    </div>
                </div>
            </div>
             <div className="flex items-center space-x-2">
                <button onClick={onEdit} className="p-2 text-slate-400 hover:text-cyan-400 rounded-md hover:bg-slate-700"><Edit size={18}/></button>
                <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-700"><Trash2 size={18}/></button>
            </div>
        </div>
    );
};

export default PasswordListItem