'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminAnalytics({ policies, leads, vehicles }: { policies: any[], leads: any[], vehicles: any[] }) {
    // 1. Total policies
    const totalPolicies = policies.length;

    // 2. Vehicle type distribution
    const vehicleTypeCount: Record<string, number> = {};
    vehicles.forEach(v => {
        vehicleTypeCount[v.type] = (vehicleTypeCount[v.type] || 0) + 1;
    });
    const vehicleTypeData = Object.keys(vehicleTypeCount).map(key => ({ name: key, value: vehicleTypeCount[key] }));

    // 3. Top user
    const userPolicyCount: Record<string, number> = {};
    policies.forEach(p => {
        const userName = p.userId?.name || 'Unknown';
        userPolicyCount[userName] = (userPolicyCount[userName] || 0) + 1;
    });
    const topUser = Object.entries(userPolicyCount).sort((a, b) => b[1] - a[1])[0];

    // 4. Active vs Expired vs Expiring
    const statusCount = { Active: 0, Expired: 0, 'Expiring Soon': 0 };
    policies.forEach(p => {
        // Calculate status dynamically if needed, or use stored status
        // Assuming status is up to date or we calculate it
        const status = p.status || 'Active'; // Default
        // @ts-ignore
        if (statusCount[status] !== undefined) statusCount[status]++;
    });
    const statusData = Object.keys(statusCount).map(key => ({ name: key, value: statusCount[key as keyof typeof statusCount] }));

    // 5. Month-wise policies
    const monthCount: Record<string, number> = {};
    policies.forEach(p => {
        const date = new Date(p.createdAt); // Or expiryDate? "Policies issued" usually means creation.
        const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthCount[month] = (monthCount[month] || 0) + 1;
    });
    const monthData = Object.keys(monthCount).map(key => ({ name: key, policies: monthCount[key] }));

    // 6. Total leads
    const totalLeads = leads.length;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card">
                <h3>Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <p style={{ color: 'var(--text-light)' }}>Total Policies</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalPolicies}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-light)' }}>Total Leads</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalLeads}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-light)' }}>Top User</p>
                        <p style={{ fontWeight: 'bold' }}>{topUser ? `${topUser[0]} (${topUser[1]})` : 'N/A'}</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-light)' }}>Most Common Vehicle</p>
                        <p style={{ fontWeight: 'bold' }}>
                            {vehicleTypeData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ height: '300px' }}>
                <h3>Policy Status</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="card" style={{ height: '300px' }}>
                <h3>Vehicle Types</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={vehicleTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name?: string, percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {vehicleTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="card" style={{ height: '300px' }}>
                <h3>Policies Issued (Month-wise)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="policies" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
