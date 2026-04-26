'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, Bike, Trophy, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState('');

    const checkAuth = () => {
        // Simple demo auth - in production use NextAuth or JWT
        if (password === 'admin123') {
            setAuthorized(true);
            fetchData();
        } else {
            toast.error('Invalid password');
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/stats/detailed'); // I'll create this endpoint
            setStats(response.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        if (!stats?.users) return;
        const headers = ['Name', 'Email', 'Role', 'Location', 'Referrals', 'Joined At'];
        const rows = stats.users.map((u: any) => [
            u.name, u.email, u.role, u.location, u.referralsCount, new Date(u.createdAt).toLocaleDateString()
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `waitlist_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-6">
                <div className="glass p-8 rounded-3xl w-full max-w-sm">
                    <h1 className="text-2xl font-black mb-6 text-center">Admin Portal</h1>
                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button onClick={checkAuth} className="btn-primary w-full">Login</button>
                </div>
            </div>
        );
    }

    if (loading) return <div className="p-8 text-center">Loading stats...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Waitlist Dashboard</h1>
                        <p className="text-gray-500">Real-time overview of Book A Ride growth</p>
                    </div>
                    <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<Users />} label="Total Users" value={stats.totalUsers} color="bg-blue-500" />
                    <StatCard icon={<UserCheck />} label="Students" value={stats.students} color="bg-green-500" />
                    <StatCard icon={<Bike />} label="Drivers" value={stats.drivers} color="bg-yellow-500" />
                    <StatCard icon={<Trophy />} label="Referrals" value={stats.totalReferrals} color="bg-purple-500" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Top Referrers */}
                    <div className="md:col-span-1 glass p-8 rounded-3xl">
                        <h3 className="text-xl font-bold mb-6">Top Referrers</h3>
                        <div className="space-y-4">
                            {stats.topReferrers.map((u: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm">{u.name}</p>
                                        <p className="text-xs text-gray-500">{u.email}</p>
                                    </div>
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-lg">
                                        {u.referralsCount} refs
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Signups */}
                    <div className="md:col-span-2 glass p-8 rounded-3xl overflow-hidden">
                        <h3 className="text-xl font-bold mb-6">Recent Signups</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                        <th className="pb-4">NAME</th>
                                        <th className="pb-4">ROLE</th>
                                        <th className="pb-4">LOCATION</th>
                                        <th className="pb-4">DATE</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {stats.users.slice(0, 5).map((u: any, idx: number) => (
                                        <tr key={idx} className="text-sm">
                                            <td className="py-4 font-medium">{u.name}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'student' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-500">{u.location}</td>
                                            <td className="py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className="glass p-6 rounded-3xl">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
                {icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-3xl font-black">{value.toLocaleString()}</p>
        </div>
    );
}
