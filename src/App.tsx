/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import CreatorFeed from './components/CreatorFeed';
import AuthModal from './components/AuthModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    return auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#e5e7eb] font-sans overflow-hidden">
      <aside className="w-64 border-r border-[#1f1f1f] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#f27d26] rounded-xl flex items-center justify-center font-bold text-black text-xl">N</div>
          <span className="text-2xl font-bold tracking-tighter text-white">NOKTEK</span>
        </div>
        
        <nav className="space-y-4 flex-1">
          {/* ... nav items */}
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col bg-[#080808] overflow-y-auto">
        <header className="h-20 border-b border-[#1f1f1f] px-8 flex items-center justify-between">
          <div />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">{user.email}</span>
              <button onClick={() => signOut(auth)} className="text-[#6b7280] text-sm hover:text-white">Logout</button>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="px-4 py-2 bg-[#f27d26] text-black font-bold rounded-lg text-sm">Login</button>
          )}
        </header>

        <CreatorFeed user={user} openAuth={() => setIsAuthModalOpen(true)} />
      </main>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}
