import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api/config";
import toast from "react-hot-toast";

const AuthFormComponent: React.FC<{ isLogin: boolean }> = ({ isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        try {
            const res = await api.post(endpoint, { email, password });
            if (res.data.token) {
                login(res.data.token);
                toast.success(isLogin ? 'Logged in successfully!' : 'Registration successful!');
                navigate('/dashboard');
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.msg || `An error occurred during ${isLogin ? 'login' : 'registration'}.`;
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <div>
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 mt-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            <button type="submit" className="w-full flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
    );
};



export default AuthFormComponent