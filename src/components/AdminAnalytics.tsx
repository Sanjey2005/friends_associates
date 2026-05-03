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
    expiryDate?: string | Date;
    userId?: string | { name?: string } | null;
};

type LeadLike = {
    status?: string;
    insuranceType?: string;
    vehicleType?: string;
    createdAt?: string | Date;
};

type VehicleLike = { type?: string };

type ChatLike = {
    lastUpdated?: string | Date;
    messages?: { sender?: string; timestamp?: string | Date }[];
};

function countBy<T>(items: T[], getKey: (item: T) => string | undefined) {
    return items.reduce<Record<string, number>>((acc, item) => {
        const key = getKey(item) || 'Other';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

function toChartData(counts: Record<string, number>) {
    return Object.keys(counts).map((key) => ({
        name: key,
        value: counts[key],
    }));
}

function isSameDay(date: Date, compareDate: Date) {
    return date.toDateString() === compareDate.toDateString();
}

export default function AdminAnalytics({
    policies,
    leads,
    vehicles,
    chats,
}: {
    policies: PolicyLike[];
    leads: LeadLike[];
    vehicles: VehicleLike[];
    chats?: ChatLike[];
}) {
    const totalPolicies = policies.length;
    const today = new Date();

    const vehicleTypeData = toChartData(countBy(vehicles, (vehicle) => vehicle.type));
    const leadVehicleTypeData = toChartData(countBy(leads, (lead) => lead.vehicleType));
    const leadInsuranceTypeData = toChartData(countBy(leads, (lead) => lead.insuranceType));

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

    const renewalBuckets = {
        '7 days': 0,
        '15 days': 0,
        '30 days': 0,
    };
    policies.forEach((policy) => {
        if (!policy.expiryDate) return;
        const expiryDate = new Date(policy.expiryDate);
        if (Number.isNaN(expiryDate.getTime())) return;
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry >= 0 && daysUntilExpiry <= 7) renewalBuckets['7 days']++;
        if (daysUntilExpiry >= 0 && daysUntilExpiry <= 15) renewalBuckets['15 days']++;
        if (daysUntilExpiry >= 0 && daysUntilExpiry <= 30) renewalBuckets['30 days']++;
    });

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
    const mostRequestedVehicle = [...leadVehicleTypeData].sort((a, b) => b.value - a.value)[0]?.name || 'N/A';
    const mostRequestedInsurance = [...leadInsuranceTypeData].sort((a, b) => b.value - a.value)[0]?.name || 'N/A';
    const completedLeads = leads.filter((lead) => lead.status === 'Completed').length;
    const pendingLeads = leads.filter((lead) => lead.status === 'Not Completed' || !lead.status).length;
    const notPickedLeads = leads.filter((lead) => lead.status === "Customer Didn't Pick").length;
    const conversionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0;
    const newLeadsToday = leads.filter((lead) => {
        if (!lead.createdAt) return false;
        const createdAt = new Date(lead.createdAt);
        return !Number.isNaN(createdAt.getTime()) && isSameDay(createdAt, today);
    }).length;
    const expiredPolicies = policies.filter((policy) => {
        if (policy.status === 'Expired') return true;
        if (!policy.expiryDate) return false;
        const expiryDate = new Date(policy.expiryDate);
        return !Number.isNaN(expiryDate.getTime()) && expiryDate < today;
    }).length;
    const expiringSoonPolicies = policies.filter((policy) => policy.status === 'Expiring Soon').length || renewalBuckets['30 days'];
    const activePolicies = policies.filter((policy) => policy.status === 'Active').length;
    const unansweredMessages = (chats || []).filter((chat) => {
        const latestMessage = chat.messages?.[chat.messages.length - 1];
        return latestMessage?.sender === 'user';
    }).length;
    const recentMessages = (chats || []).filter((chat) => {
        if (!chat.lastUpdated) return false;
        const updatedAt = new Date(chat.lastUpdated);
        return !Number.isNaN(updatedAt.getTime()) && today.getTime() - updatedAt.getTime() <= 24 * 60 * 60 * 1000;
    }).length;

    const priorityItems = [
        { label: 'New leads today', value: newLeadsToday },
        { label: 'Incomplete leads', value: pendingLeads },
        { label: 'Customers to retry', value: notPickedLeads },
        { label: 'Expired policies', value: expiredPolicies },
        { label: 'Renewals in 30 days', value: renewalBuckets['30 days'] },
        { label: 'Unanswered messages', value: unansweredMessages },
    ];

    const businessInsight =
        renewalBuckets['30 days'] > 0
            ? `${renewalBuckets['30 days']} policies need renewal follow-up in the next 30 days.`
            : mostRequestedVehicle !== 'N/A'
              ? `Most quote requests are for ${mostRequestedVehicle} insurance.`
              : 'Lead and renewal insights will appear as customer activity grows.';

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
                <h3 style={chartTitle}>Today&apos;s Priorities</h3>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginTop: '0.5rem',
                    }}
                >
                    {priorityItems.map((item) => (
                        <div key={item.label}>
                            <p style={statLabel}>{item.label}</p>
                            <p style={statValue}>{item.value}</p>
                        </div>
                    ))}
                </div>
                <p
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        marginTop: '1.25rem',
                    }}
                >
                    {businessInsight}
                </p>
            </div>

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
                        <p style={statLabel}>Active Policies</p>
                        <p style={statValue}>{activePolicies}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Conversion Rate</p>
                        <p style={statValue}>{conversionRate}%</p>
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

            <div style={cardStyle}>
                <h3 style={chartTitle}>Lead Insights</h3>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.25rem',
                        marginTop: '0.5rem',
                    }}
                >
                    <div>
                        <p style={statLabel}>Completed Leads</p>
                        <p style={statValue}>{completedLeads}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Pending Leads</p>
                        <p style={statValue}>{pendingLeads}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Most Requested Cover</p>
                        <p style={statValueSmall}>{mostRequestedInsurance}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Recent Messages</p>
                        <p style={statValue}>{recentMessages}</p>
                    </div>
                </div>
            </div>

            <div style={cardStyle}>
                <h3 style={chartTitle}>Policy Renewal Window</h3>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.25rem',
                        marginTop: '0.5rem',
                    }}
                >
                    <div>
                        <p style={statLabel}>Expired</p>
                        <p style={statValue}>{expiredPolicies}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Expiring Soon</p>
                        <p style={statValue}>{expiringSoonPolicies}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Within 7 Days</p>
                        <p style={statValue}>{renewalBuckets['7 days']}</p>
                    </div>
                    <div>
                        <p style={statLabel}>Within 15 Days</p>
                        <p style={statValue}>{renewalBuckets['15 days']}</p>
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
                <h3 style={chartTitle}>Leads by Insurance Type</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={leadInsuranceTypeData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e8e6dc" />
                            <XAxis dataKey="name" tick={axisStyle} stroke="#87867f" />
                            <YAxis tick={axisStyle} stroke="#87867f" />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(201,100,66,0.08)' }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {leadInsuranceTypeData.map((_, index) => (
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
