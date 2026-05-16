import React, { useState } from 'react';
import { Mail, Lock, User, FileImage } from 'lucide-react';
import { 
  auth, db, storage, createUserWithEmailAndPassword, 
  signInWithPopup, googleProvider, doc, setDoc, 
  query, collection, where, getDocs, ref, uploadBytes, getDownloadURL 
} from '../lib/firebase';
import { serverTimestamp } from 'firebase/firestore';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUserId(userCredential.user.uid);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Username validation
    if (!/^[a-zA-Z0-9_]{4,15}$/.test(username)) {
      setError('Username must be 4-15 characters and contain only letters, numbers, or underscores.');
      return;
    }

    try {
      // Unique username check
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('Username is already taken.');
        return;
      }

      let photoURL = '';
      if (file) {
        const storageRef = ref(storage, `avatars/${userId}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email,
        displayName,
        username,
        bio,
        photoURL,
        createdAt: serverTimestamp(),
        walletBalance: 0
      });
      // Redirect or handle post-registration
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#1f1f1f] p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{step === 1 ? 'Join Noktek' : 'Complete Profile'}</h2>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1a1a1a] p-2 rounded" required />
             <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#1a1a1a] p-2 rounded" required />
             <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-[#1a1a1a] p-2 rounded" required />
             <button type="submit" className="w-full bg-[#f27d26] py-2 rounded font-bold">Continue</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder="Username (4-15 chars, unique)" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#1a1a1a] p-2 rounded" required />
            <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-[#1a1a1a] p-2 rounded" />
            <label className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded cursor-pointer">
              <FileImage size={18} />
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
              <span>{file ? file.name : 'Upload Profile Picture'}</span>
            </label>
            <button type="submit" className="w-full bg-[#f27d26] py-2 rounded font-bold">Complete Setup</button>
          </form>
        )}
      </div>
    </div>
  );
}
