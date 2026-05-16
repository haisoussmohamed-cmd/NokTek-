import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from '../lib/firebase';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#1f1f1f] p-8 rounded-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6b7280] hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-[#6b7280]" size={18} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1a1a1a] text-white p-2 pl-10 rounded-lg outline-none" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#6b7280]" size={18} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#1a1a1a] text-white p-2 pl-10 rounded-lg outline-none" required />
          </div>
          <button type="submit" className="w-full bg-[#f27d26] text-black font-bold py-2 rounded-lg">{isLogin ? 'Login' : 'Register'}</button>
        </form>

        <div className="my-4 text-center text-[#6b7280] text-sm">OR</div>
        <button onClick={handleGoogleSignIn} className="w-full bg-white text-black font-bold py-2 rounded-lg flex items-center justify-center gap-2">
            <User size={18} />
            Continue with Google
        </button>
        
        <p className="mt-4 text-center text-[#9ca3af] text-sm cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
