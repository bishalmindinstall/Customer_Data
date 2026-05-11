/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Star, 
  Filter, 
  Download,
  Calendar,
  Layers,
  ChevronDown,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart, 
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend
} from 'recharts';
import { mockData, type CustomerPurchase } from './data/mockData';
import { cn } from './lib/utils';

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string;
  trend?: string;
  trendValue?: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2 group"
  >
    <div className="flex items-center gap-2">
      <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">{title}</p>
      <div className={cn("w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", color)}></div>
    </div>
    <div className="flex flex-col">
      <h3 className="text-3xl font-light text-white font-mono tracking-tight">{value}</h3>
      {trend && (
        <p className={cn("text-[10px] mt-1 font-mono uppercase tracking-tight", trend === 'positive' ? "text-emerald-500" : "text-slate-500")}>
          {trendValue} {trend === 'positive' ? 'increase' : 'variance'}
        </p>
      )}
    </div>
  </motion.div>
);

const ChartContainer = ({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-[#15181e] border border-slate-800/50 rounded-xl p-8 flex flex-col shadow-2xl", className)}>
    <div className="flex justify-between items-center mb-8">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {title} {subtitle && <span className="italic font-serif normal-case text-slate-600 ml-2">{subtitle}</span>}
      </h4>
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-slate-800"></div>
      </div>
    </div>
    <div className="flex-1 w-full min-h-[300px]">
      {children}
    </div>
  </div>
);

// --- Colors ---
const COLORS = ['#10b981', '#334155', '#475569', '#1e293b', '#0f172a', '#020617'];

export default function App() {
  const [data] = useState<CustomerPurchase[]>(mockData);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [seasonFilter, setSeasonFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Filtered Data ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesGender = genderFilter === 'All' || item.gender === genderFilter;
      const matchesSeason = seasonFilter === 'All' || item.season === seasonFilter;
      const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesGender && matchesSeason && matchesSearch;
    });
  }, [data, categoryFilter, genderFilter, seasonFilter, searchTerm]);

  // --- Metrics ---
  const stats = useMemo(() => {
    const totalRev = filteredData.reduce((acc, curr) => acc + curr.purchaseAmount, 0);
    const avgSpend = filteredData.length ? totalRev / filteredData.length : 0;
    const avgRating = filteredData.length ? filteredData.reduce((acc, curr) => acc + curr.reviewRating, 0) / filteredData.length : 0;
    
    return {
      totalRev,
      customers: filteredData.length,
      avgSpend,
      avgRating
    };
  }, [filteredData]);

  // --- Chart Data ---
  const revenueByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(d => {
      map[d.category] = (map[d.category] || 0) + d.purchaseAmount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const ageData = useMemo(() => {
    const bins = Array(6).fill(0);
    filteredData.forEach(d => {
      const index = Math.min(Math.floor((d.age - 18) / 10), 5);
      bins[index]++;
    });
    const labels = ['18-27', '28-37', '38-47', '48-57', '58-67', '68+'];
    return labels.map((name, i) => ({ name, count: bins[i] }));
  }, [filteredData]);

  const paymentData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(d => {
      map[d.paymentMethod] = (map[d.paymentMethod] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const ratingVsPrice = useMemo(() => {
    return filteredData.slice(0, 100).map(d => ({
      x: d.purchaseAmount,
      y: d.reviewRating,
      category: d.category
    }));
  }, [filteredData]);

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar (Filters) */}
      <aside className="w-72 border-r border-slate-800 flex flex-col bg-[#0f1115] shrink-0">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <h2 className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500">Analytics v2.4</h2>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Customer Hub</h1>
        </div>

        <div className="p-8 flex-1 space-y-10 overflow-y-auto custom-scrollbar">
          <section>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 block mb-6 italic">Control Segment</label>
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category Selection</span>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-[#1a1c23] border border-slate-800 rounded px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">ALL_CATEGORIES</option>
                  <option value="Clothing">CLOTHING</option>
                  <option value="Accessories">ACCESSORIES</option>
                  <option value="Footwear">FOOTWEAR</option>
                  <option value="Outerwear">OUTERWEAR</option>
                </select>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Gender Filter</span>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Male', 'Female', 'Non-binary'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(g)}
                      className={cn(
                        "px-3 py-2 rounded text-[10px] font-mono tracking-tighter transition-all text-left border",
                        genderFilter === g 
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {g.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Seasonal Sync</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Spring', 'Summer', 'Fall', 'Winter'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSeasonFilter(s)}
                      className={cn(
                        "px-2 py-1 rounded text-[9px] font-bold tracking-widest transition-all border",
                        seasonFilter === s
                          ? "bg-emerald-500 text-slate-900 border-emerald-500"
                          : "bg-transparent border-slate-800 text-slate-600 hover:border-slate-700"
                      )}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 block mb-4">Quick Search</label>
            <div className="relative">
              <Search className="w-3 h-3 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="ENTRY_QUERY..."
                className="w-full pl-8 pr-4 py-2 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-400 focus:outline-none focus:border-emerald-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>
        </div>

        <div className="p-8 border-t border-slate-800">
          <div className="bg-[#15181e] rounded p-4 border border-slate-800/50">
            <p className="text-[9px] text-slate-600 uppercase font-bold tracking-[0.2em] mb-1">Dataset Stability</p>
            <p className="text-[11px] text-emerald-500 font-mono">ENCRYPTED / SYNCED</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#0a0b0d] overflow-y-auto custom-scrollbar">
        {/* Header Metrics */}
        <header className="p-10 pb-6 flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1">
              <StatCard 
                title="Total Revenue" 
                value={`$${stats.totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                icon={DollarSign} 
                color="bg-emerald-500"
                trend="positive"
                trendValue="+12.4%"
              />
              <StatCard 
                title="Customers" 
                value={stats.customers.toLocaleString()} 
                icon={Users} 
                color="bg-slate-500"
                trendValue="Real-time count"
              />
              <StatCard 
                title="Avg Purchase" 
                value={`$${stats.avgSpend.toFixed(2)}`} 
                icon={Layers} 
                color="bg-slate-500"
                trendValue="Per session"
              />
              <StatCard 
                title="Review Avg" 
                value={stats.avgRating.toFixed(2)} 
                icon={Star} 
                color="bg-rose-500"
                trend="negative"
                trendValue="-0.15 variance"
              />
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 bg-emerald-500 text-slate-900 px-5 py-2 rounded text-[11px] font-bold tracking-widest uppercase hover:bg-emerald-400 transition-colors">
                <Download className="w-3 h-3" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-slate-800 via-slate-800/50 to-transparent"></div>
        </header>

        {/* Content Grid */}
        <div className="px-10 pb-10 space-y-10">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <ChartContainer 
              title="Revenue Distribution" 
              subtitle="by Category" 
              className="xl:col-span-8"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCategory} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#475569', fontWeight: 600, letterSpacing: '0.1em' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#475569', fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }}
                    itemStyle={{ color: '#10b981' }}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={40}>
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Loyalty Segments" className="xl:col-span-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }} />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="rect" 
                    formatter={(val) => <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
             <ChartContainer title="Age Demographics" subtitle="Volume by Bracket">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ageData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569', fontFamily: 'monospace' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer title="Correlation Matrix" subtitle="Rating vs Price">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis type="number" dataKey="x" name="Amount" unit="$" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis type="number" dataKey="y" name="Rating" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <ZAxis type="number" range={[60, 200]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }} />
                    <Scatter name="Purchases" data={ratingVsPrice}>
                      {ratingVsPrice.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#10b981" fillOpacity={0.4} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
          </div>

          {/* Detailed Transaction Log */}
          <div className="bg-[#15181e] border border-slate-800/50 rounded-xl overflow-hidden flex flex-col shadow-2xl">
            <div className="px-8 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Purchase Ledger / <span className="text-slate-600">High Frequency Stream</span>
              </h4>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">Status: Live</span>
                <span className="text-[10px] font-mono text-slate-600">Showing {Math.min(filteredData.length, 50)} items</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/40 border-b border-slate-800">
                    {['ID', 'Item', 'Category', 'Amount', 'Rating', 'Status'].map(h => (
                      <th key={h} className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs font-mono text-slate-400 divide-y divide-slate-800/30">
                  <AnimatePresence>
                    {filteredData.slice(0, 50).map((row, idx) => (
                      <motion.tr 
                        key={row.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(idx * 0.01, 0.5) }}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-8 py-4 text-emerald-500/70">#{row.id}</td>
                        <td className="px-8 py-4 text-slate-300 font-sans">{row.item}</td>
                        <td className="px-8 py-4">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{row.category}</span>
                        </td>
                        <td className="px-8 py-4 text-emerald-400 font-bold">${row.purchaseAmount.toFixed(2)}</td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-emerald-500">★</span>
                            <span className="text-slate-300 font-bold">{row.reviewRating}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          {row.subscriptionStatus === 'Yes' ? (
                            <span className="text-[9px] px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-500 bg-emerald-500/5 font-bold tracking-tighter">SUBSCRIBER</span>
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 rounded border border-slate-800 text-slate-600 font-bold tracking-tighter">GUEST</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredData.length > 50 && (
              <div className="p-4 bg-slate-900/50 text-center border-t border-slate-800">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Additional records condensed</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
