import { ShieldCheck } from "lucide-react";
import AuthFormComponent from "../components/AuthFormComponent";
import { useState } from "react";

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-2xl border border-slate-700">
                <div className="text-center">
                    <ShieldCheck className="mx-auto h-12 w-auto text-cyan-400"/>
                    <h1 className="text-3xl font-bold mt-4">Secure Cloud Vault</h1>
                    <p className="text-slate-400 mt-2">{isLogin ? 'Log in to access your vault' : 'Create an account to get started'}</p>
                </div>
                <AuthFormComponent isLogin={isLogin} />
                 <p className="text-center text-sm text-slate-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-cyan-400 hover:text-cyan-300">
                        {isLogin ? 'Register here' : 'Login here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth