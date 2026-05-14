/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#e5e7eb] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#1f1f1f] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#f27d26] rounded-xl flex items-center justify-center font-bold text-black text-xl">N</div>
          <span className="text-2xl font-bold tracking-tighter text-white">NOKTEK</span>
        </div>
        
        <nav className="space-y-4 flex-1">
          <div className="text-[10px] uppercase tracking-widest text-[#6b7280] mb-2">Platform Ecosystem</div>
          <div className="flex items-center gap-3 p-3 bg-[#111111] border-l-2 border-[#f27d26] text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            <span>Creator Feed</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-[#9ca3af] hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span>Marketplace</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-[#9ca3af] hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            <span>Ticket Draws</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-[#9ca3af] hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>Referral Network</span>
          </div>
        </nav>
      </aside>
      
      {/* Main Viewport */}
      <main className="flex-1 flex flex-col bg-[#080808]">
        {/* Placeholder content for now */}
        <div className="p-8 text-white">Main Viewport Content Area</div>
      </main>
    </div>
  );
}
