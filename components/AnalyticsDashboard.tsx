import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { AnalyticsData } from '../types';
import { fetchAnalytics } from '../services/dbService';
import { TrendingUp, Users, Activity, FileText } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const analytics = await fetchAnalytics();
      setData(analytics);
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h2>
        <p className="text-slate-500 mt-1">Real-time insights into forum engagement and trends</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Total Posts</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">1,234</div>
          <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
            <TrendingUp size={12} className="mr-1" /> +12% from last week
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Active Users</h3>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">856</div>
          <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
            <TrendingUp size={12} className="mr-1" /> +5% from last week
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Engagement Rate</h3>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">24%</div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Avg comments per post
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Avg. Response Time</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">2.5h</div>
          <div className="text-xs text-red-500 font-medium mt-1">
             -10% slower than avg
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart: Daily Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Daily Engagement Activity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="posts" name="New Posts" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="comments" name="Comments" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Distribution by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Discussions by Category</h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.postsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.postsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Contributors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800">Top Contributors of the Week</h3>
        </div>
        <div className="p-0">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-3 w-12">#</th>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3">Engagement Score</th>
                        <th className="px-6 py-3 text-right">Trend</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.topContributors.map((user, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800">{idx + 1}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(user.engagement * 2, 100)}%` }}></div>
                                    </div>
                                    <span className="text-xs text-slate-500">{user.engagement} pts</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right text-green-500 text-xs font-bold">
                                +{Math.floor(Math.random() * 10)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};