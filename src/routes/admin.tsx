import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Users, Settings, PlusCircle, 
  Search, Bell, Edit3, Trash2, ExternalLink, BarChart3, ChevronRight 
} from 'lucide-react';

export default function AdminRoute() {
  const [activeTab, setActiveTab] = useState('posts');

  // Realistic mock data for display
  const [contentItems] = useState([
    { id: title: 'Luxury Brand Launch', date: 'Jul ', status: 'Published' },
    { id: title: 'Summer Collection Preview', date: 'Jul ', status: 'Draft' },
    { id: title: 'date: 'Jun ', status: 'Published' },
  ]);

  return (
    <div className="flex h-screen bg-[#ffafc]">
      {/* SIDEBAR - Dark Luxury Theme */}
      <aside className="w-72 bg-[#fa] text-white hidden md:flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
             Site Control
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveTab('dash')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'dash' ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('posts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'posts' ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <FileText size={20} /> Manage Content
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <Users size={20} /> User Management
          </button>
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Preferences</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <Settings size={20} /> Global Settings
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search entries, logs, or users..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition">
              <Bell size={20} className="text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">Super Administrator</p>
              </div>
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/30">AU</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* WELCOME SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Overview Dashboard</h2>
            <p className="text-slate-500">Welcome back. Here is what's happening with your site today.</p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase">Active Content</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-800">1,284</h3>
                  <p className="text-xs text-green-600 font-bold mt-2">+12% from last month</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FileText size={24} /></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase">Site Traffic</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-800">42.5k</h3>
                  <p className="text-xs text-blue-600 font-bold mt-2">Currently 412 active now</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 size={24} /></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-dashed border-amber-300 bg-amber-50/30 flex items-center justify-center group cursor-pointer">
              <div className="text-center">
                <PlusCircle size={32} className="mx-auto text-amber-600 group-hover:scale-110 transition" />
                <p className="mt-2 font-bold text-amber-800 uppercase text-xs tracking-widest">Create New Post</p>
              </div>
            </div>
          </div>

          {/* DATA TABLE SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-amber-500" /> Recent Content Publications
              </h2>
              <button className="text-xs text-amber-600 font-bold flex items-center gap-1 hover:underline">View All Records <ChevronRight size={14} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Article Title</th>
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Visibility</th>
                    <th className="px-6 py-4 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-6 py-4 font-semibold text-slate-800">{item.title}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{item.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[px] font-bold uppercase tracking-widest ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button title="Edit Post" className="text-slate-400 hover:text-amber-600 transition"><Edit3 size={18} /></button>
                        <button title="View Live" className="text-slate-400 hover:text-blue-600 transition"><ExternalLink size={18} /></button>
                        <button title="Delete" className="text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
