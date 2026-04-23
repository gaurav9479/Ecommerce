import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:9000';

// ── Design tokens ──────────────────────────────────────────────────────────────
const PALETTE = {
    primary:   '#6366f1',
    success:   '#10b981',
    warning:   '#f59e0b',
    error:     '#ef4444',
    info:      '#3b82f6',
    purple:    '#8b5cf6',
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
const CAT_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

// ── Formatters ─────────────────────────────────────────────────────────────────
const fmtINR = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(1)}K` : `₹${v}`;
const fmtINRFull = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

// ── Sub-components ──────────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, icon, growth, color = PALETTE.primary }) => {
    const up = Number(growth) > 0;
    const neutral = growth === null || growth === undefined;
    return (
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
             className="rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>{value}</p>
                {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{sub}</p>}
            </div>
            {!neutral && (
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold" style={{ color: up ? PALETTE.success : PALETTE.error }}>
                        {up ? '↑' : '↓'} {Math.abs(growth)}%
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-faint)' }}>vs last month</span>
                </div>
            )}
            <div className="h-1 rounded-full opacity-30" style={{ backgroundColor: color }} />
        </div>
    );
};

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-5">
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
    </div>
);

const ChartCard = ({ title, subtitle, children, className = '' }) => (
    <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
         className={`rounded-xl p-5 ${className}`}>
        <SectionHeader title={title} subtitle={subtitle} />
        {children}
    </div>
);

// Custom tooltip
const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg px-3 py-2 text-xs shadow-lg" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
            <p className="font-semibold mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>{p.name}: {formatter ? formatter(p.value) : p.value}</p>
            ))}
        </div>
    );
};

// ── Mock data for empty states ────────────────────────────────────────────────────
const genMockRevenue = () => {
    const data = []; let base = 12000;
    for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        base = Math.max(0, base + (Math.random() - 0.42) * 4000);
        data.push({ date, revenue: Math.round(base) });
    }
    return data;
};
const genMockOrders = (revData) => revData.map(d => ({ date: d.date, orders: Math.round(d.revenue / 3800 + Math.random() * 2) }));
const MOCK_STATUS   = [{ name: 'Delivered', value: 48 }, { name: 'Processing', value: 22 }, { name: 'Shipped', value: 18 }, { name: 'Cancelled', value: 12 }];
const MOCK_CATS     = [{ name: 'Smartphones', value: 180000 }, { name: 'Laptops', value: 95000 }, { name: 'Headphones', value: 62000 }, { name: 'Cameras', value: 41000 }, { name: 'Tablets', value: 28000 }];
const MOCK_PRODUCTS = [
    { name: 'MacBook Pro 14"', units: 12, revenue: 203988 },
    { name: 'Samsung S24 Ultra', units: 21, revenue: 181419 },
    { name: 'Sony WH-1000XM5', units: 38, revenue: 113962 },
    { name: 'Nikon Z50 Camera', units: 9, revenue: 89991 },
    { name: 'iPad Pro 12.9"', units: 15, revenue: 74985 },
];
const MOCK_WEEKLY = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    revenue: Math.round(40000 + Math.random() * 60000),
}));

// ── Main Component ────────────────────────────────────────────────────────────
const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState('revenue'); // revenue | orders
    const [usingMock, setUsingMock] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/api/v1/orders/admin/analytics`, { withCredentials: true });
                const raw = res.data.data;
                // If no real data, fall through to mock
                if (!raw.revenueChart?.length && !raw.kpis?.totalOrders) throw new Error('empty');
                setData(raw);
                setUsingMock(false);
            } catch {
                // Use demo mock data
                const mockRev = genMockRevenue();
                setData({
                    kpis: { totalRevenue: 708345, totalOrders: 156, avgOrderValue: 4541, totalProducts: 42, revenueGrowth: 18.4, ordersGrowth: 12.1, conversionRate: 74.4 },
                    revenueChart: mockRev,
                    ordersChart: genMockOrders(mockRev),
                    statusChart: MOCK_STATUS,
                    categoryChart: MOCK_CATS,
                    topProducts: MOCK_PRODUCTS,
                    inventoryHealth: { healthy: 28, low: 9, out: 5 },
                    weeklyChart: MOCK_WEEKLY,
                });
                setUsingMock(true);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 skeleton h-64 rounded-xl" />
                    <div className="skeleton h-64 rounded-xl" />
                </div>
            </div>
        );
    }

    const { kpis, revenueChart, ordersChart, statusChart, categoryChart, topProducts, inventoryHealth, weeklyChart } = data;

    const chartData = activeChart === 'revenue'
        ? revenueChart?.slice(-14)
        : ordersChart?.slice(-14);

    const totalInventory = (inventoryHealth?.healthy || 0) + (inventoryHealth?.low || 0) + (inventoryHealth?.out || 0);

    return (
        <div className="p-5 space-y-6 animate-fadeIn">

            {/* Demo banner */}
            {usingMock && (
                <div className="rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                    <span>⚠️</span>
                    <span><strong>Demo data</strong> — shown because no real orders exist yet. Charts will auto-update once orders come in.</span>
                </div>
            )}

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard
                    label="Total Revenue"
                    value={fmtINRFull(kpis.totalRevenue)}
                    sub={`This month: ${fmtINR(kpis.thisMonthRevenue || 0)}`}
                    icon="💰"
                    growth={kpis.revenueGrowth}
                    color={PALETTE.primary}
                />
                <KPICard
                    label="Total Orders"
                    value={kpis.totalOrders}
                    sub={`Delivered: ${statusChart?.find(s => s.name === 'Delivered')?.value || 0}`}
                    icon="📦"
                    growth={kpis.ordersGrowth}
                    color={PALETTE.info}
                />
                <KPICard
                    label="Avg. Order Value"
                    value={fmtINRFull(kpis.avgOrderValue)}
                    sub="Per delivered order"
                    icon="🧾"
                    growth={null}
                    color={PALETTE.warning}
                />
                <KPICard
                    label="Conversion Rate"
                    value={`${kpis.conversionRate}%`}
                    sub={`${kpis.totalProducts} products listed`}
                    icon="📈"
                    growth={null}
                    color={PALETTE.success}
                />
            </div>

            {/* ── Revenue / Orders chart ── */}
            <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} className="rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                            {activeChart === 'revenue' ? '📈 Revenue Trend' : '🛒 Order Volume'} — Last 14 Days
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                            {activeChart === 'revenue' ? 'Daily delivered revenue' : 'Daily order count'}
                        </p>
                    </div>
                    <div className="flex text-xs rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                        {[['revenue', '₹ Revenue'], ['orders', '📦 Orders']].map(([key, label]) => (
                            <button key={key} onClick={() => setActiveChart(key)}
                                className="px-3 py-1.5 font-medium transition-colors"
                                style={{
                                    backgroundColor: activeChart === key ? 'var(--color-primary)' : 'transparent',
                                    color: activeChart === key ? 'white' : 'var(--color-text-muted)',
                                }}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={PALETTE.primary} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={PALETTE.primary} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} tickFormatter={activeChart === 'revenue' ? fmtINR : v => v} />
                        <Tooltip content={<CustomTooltip formatter={activeChart === 'revenue' ? fmtINRFull : v => v} />} />
                        <Area
                            type="monotone"
                            dataKey={activeChart === 'revenue' ? 'revenue' : 'orders'}
                            name={activeChart === 'revenue' ? 'Revenue' : 'Orders'}
                            stroke={PALETTE.primary}
                            strokeWidth={2}
                            fill="url(#areaGrad)"
                            dot={false}
                            activeDot={{ r: 4, fill: PALETTE.primary }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* ── Row 2: Status Pie + Category Bar ── */}
            <div className="grid md:grid-cols-2 gap-4">

                {/* Order Status Donut */}
                <ChartCard title="🔵 Order Status Breakdown" subtitle="All-time distribution">
                    <div className="flex items-center gap-4">
                        <ResponsiveContainer width="55%" height={180}>
                            <PieChart>
                                <Pie
                                    data={statusChart}
                                    cx="50%" cy="50%"
                                    innerRadius={50} outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {statusChart?.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2.5 flex-1">
                            {statusChart?.map((s, i) => {
                                const total = statusChart.reduce((a, b) => a + b.value, 0);
                                const pct = total > 0 ? ((s.value / total) * 100).toFixed(0) : 0;
                                return (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium truncate" style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
                                                <span className="text-xs font-bold ml-2" style={{ color: 'var(--color-text)' }}>{pct}%</span>
                                            </div>
                                            <div className="mt-1 h-1 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                                                <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ChartCard>

                {/* Category Revenue Bar */}
                <ChartCard title="📂 Revenue by Category" subtitle="Delivered orders only">
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={categoryChart} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                            <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} tickFormatter={fmtINR} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip content={<CustomTooltip formatter={fmtINRFull} />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                            <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]} maxBarSize={18}>
                                {categoryChart?.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* ── Row 3: Top Products Table + Inventory ── */}
            <div className="grid md:grid-cols-3 gap-4">

                {/* Top Products */}
                <div className="md:col-span-2" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="p-5">
                        <SectionHeader title="🏆 Top Selling Products" subtitle="By total revenue generated" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
                                    {['Rank', 'Product', 'Units Sold', 'Revenue', 'Share'].map(h => (
                                        <th key={h} className="px-5 py-2.5 text-left font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts?.map((p, i) => {
                                    const totalRev = topProducts.reduce((a, b) => a + b.revenue, 0);
                                    const share = totalRev > 0 ? ((p.revenue / totalRev) * 100).toFixed(0) : 0;
                                    const medals = ['🥇','🥈','🥉'];
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                                            <td className="px-5 py-3 text-base">{medals[i] || `#${i + 1}`}</td>
                                            <td className="px-5 py-3 font-medium max-w-[180px] truncate" style={{ color: 'var(--color-text)' }}>{p.name}</td>
                                            <td className="px-5 py-3" style={{ color: 'var(--color-text-secondary)' }}>{p.units} units</td>
                                            <td className="px-5 py-3 font-bold" style={{ color: 'var(--color-text)' }}>{fmtINRFull(p.revenue)}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                                                        <div className="h-1.5 rounded-full" style={{ width: `${share}%`, backgroundColor: CAT_COLORS[i] }} />
                                                    </div>
                                                    <span style={{ color: 'var(--color-text-muted)' }}>{share}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Health */}
                <div className="space-y-4">
                    <ChartCard title="📦 Inventory Health" subtitle="Current stock levels">
                        <div className="space-y-3 mt-1">
                            {[
                                { label: 'Healthy (>10)', count: inventoryHealth?.healthy || 0, color: PALETTE.success },
                                { label: 'Low Stock (1-10)', count: inventoryHealth?.low || 0, color: PALETTE.warning },
                                { label: 'Out of Stock', count: inventoryHealth?.out || 0, color: PALETTE.error },
                            ].map((item, i) => {
                                const pct = totalInventory > 0 ? Math.round((item.count / totalInventory) * 100) : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                                            <span className="text-xs font-bold" style={{ color: item.color }}>{item.count} SKUs</span>
                                        </div>
                                        <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                                            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
                            <p className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>{totalInventory}</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total SKUs tracked</p>
                        </div>
                    </ChartCard>

                    {/* Quick stats */}
                    <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} className="rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Quick Stats</p>
                        {[
                            { label: 'Fulfilment Rate', value: `${kpis.conversionRate}%`, color: PALETTE.success },
                            { label: 'Cancelled Orders', value: statusChart?.find(s => s.name === 'Cancelled')?.value || 0, color: PALETTE.error },
                            { label: 'Avg Order Value', value: fmtINR(kpis.avgOrderValue), color: PALETTE.primary },
                        ].map((s, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
                                <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Row 4: Weekly Revenue Bar ── */}
            <ChartCard title="📅 Weekly Revenue — Last 12 Weeks" subtitle="Useful for spotting seasonal patterns">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-faint)' }} axisLine={false} tickLine={false} tickFormatter={fmtINR} />
                        <Tooltip content={<CustomTooltip formatter={fmtINRFull} />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                        <Bar dataKey="revenue" name="Revenue" fill={PALETTE.primary} radius={[3, 3, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

        </div>
    );
};

export default AnalyticsDashboard;
