'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

const COLORS = ['#c96442', '#d97757', '#4d4c48', '#87867f', '#b0aea5'];

const chartTitle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.125rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    marginBottom: '1rem',
    letterSpacing: '-0.01em',
};

const axisStyle = { fontSize: 12, fill: '#5e5d59', fontFamily: 'var(--font-inter), system-ui, sans-serif' };

const tooltipStyle = {
    background: '#faf9f5',
    border: '1px solid #f0eee6',
    borderRadius: 8,
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
    color: '#141413',
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontSize: 13,
};

const statLabel: React.CSSProperties = {
    color: 'var(--color-text-secondary)',
    fontSize: '0.8rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.375rem',
};

const statValue: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.625rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    lineHeight: 1.2,
};

const statValueSmall: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.125rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    lineHeight: 1.3,
};

type PolicyLike = {
    status?: string;
    createdAt?: string | Date;
    userId?: string | { name?: string } | null;
};

type VehicleLike = { type?: string };

export default function AdminAnalytics({
    policies,
    leads,
    vehicles,
}: {
    policies: PolicyLike[];
    leads: unknown[];
    vehicles: VehicleLike[];
}) {
    const totalPolicies = policies.length;

    const vehicleTypeCount: Record<string, number> = {};
    vehicles.forEach((v) => {
        const key = v.type || 'Other';
        vehicleTypeCount[key] = (vehicleTypeCount[key] || 0) + 1;
    });
    const vehicleTypeData = Object.keys(vehicleTypeCount).map((key) => ({
        name: key,
        value: vehicleTypeCount[key],
    }));

    const userPolicyCount: Record<string, number> = {};
    policies.forEach((p) => {
        const userName = typeof p.userId === 'object' && p.userId ? p.userId.name || 'Unknown' : 'Unknown';
        userPolicyCount[userName] = (userPolicyCount[userName] || 0) + 1;
    });
    const topUser = Object.entries(userPolicyCount).sort((a, b) => b[1] - a[1])[0];

    const statusCount: Record<string, number> = { Active: 0, Expired: 0, 'Expiring Soon': 0 };
    policies.forEach((p) => {
        const status = p.status || 'Active';
        if (statusCount[status] !== undefined) statusCount[status]++;
    });
    const statusData = Object.keys(statusCount).map((key) => ({
        name: key,
        value: statusCount[key],
    }));

    const monthCount: Record<string, number> = {};
    policies.forEach((p) => {
        const date = p.createdAt ? new Date(p.createdAt) : new Date(0);
        const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthCount[month] = (monthCount[month] || 0) + 1;
    });
    const monthData = Object.keys(monthCount).map((key) => ({
        name: key,
        policies: monthCount[key],
    }));

    const totalLeads = leads.length;
    const mostCommonVehicle = [...vehicleTypeData].sort((a, b) => b.value - a.value)[0]?.name || 'N/A';

    const cardStyle: React.CSSProperties = {
        background: 'var(--color-ivory)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
            }}
        >
            <div style={cardStyle}>
                <h3 style={chartTitle}>Overview</h3>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.25rem',
                        marginTop: '0.5rem',
                    }}
                >
                    <div>
                        <p style={statLabel}>Total Policies</p>
                        <p style={statValue}>{totalPolicies}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Total Leads</p>
                        <p style={statValue}>{totalLeads}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Top User</p>
                        <p style={statValueSmall}>
                            {topUser ? `${topUser[0]} (${topUser[1]})` : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p style={statLabel}>Most Common Vehicle</p>
                        <p style={statValueSmall}>{mostCommonVehicle}</p>
                    </div>
                </div>
            </div>

            <div style={{ ...cardStyle, height: '340px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={chartTitle}>Policy Status</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e8e6dc" />
                            <XAxis dataKey="name" tick={axisStyle} stroke="#87867f" />
                            <YAxis tick={axisStyle} stroke="#87867f" />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(201,100,66,0.08)' }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {statusData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ ...cardStyle, height: '340px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={chartTitle}>Vehicle Types</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={vehicleTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: { name?: string; percent?: number }) =>
                                    `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`
                                }
                                outerRadius={90}
                                dataKey="value"
                            >
                                {vehicleTypeData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ ...cardStyle, height: '340px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={chartTitle}>Policies Issued (Monthly)</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e8e6dc" />
                            <XAxis dataKey="name" tick={axisStyle} stroke="#87867f" />
                            <YAxis tick={axisStyle} stroke="#87867f" />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line
                                type="monotone"
                                dataKey="policies"
                                stroke="#c96442"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#c96442' }}
                                activeDot={{ r: 6, fill: '#c96442' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
