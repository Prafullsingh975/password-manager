import toast from "react-hot-toast";
import LockScreen from "../components/LockScreen";
import { useEffect, useState } from "react";
import { api } from "../api/config";
import Vault from "../components/Vault";

const Dashboard: React.FC = () => {
    const [vault, setVault] = useState<PasswordEntry[]>([]);
    const [masterPassword, setMasterPassword] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                const res = await api.get('/vault');
                if (res.data.data === null) {
                    setIsNewUser(true);
                } else {
                    sessionStorage.setItem('encryptedVault', res.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error('Could not fetch vault data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVault();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">Loading Vault...</div>;
    }

    if (isLocked) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                <LockScreen 
                    isNewUser={isNewUser}
                    onUnlock={(password, decryptedData) => {
                        setMasterPassword(password);
                        setVault(decryptedData);
                        setIsLocked(false);
                        sessionStorage.removeItem('encryptedVault');
                    }}
                />
            </div>
        );
    }
    
    return <Vault initialVault={vault} masterPassword={masterPassword!} onLock={() => {
        setIsLocked(true);
        setMasterPassword(null);
        setVault([]);
    }} />;
};


export default Dashboard