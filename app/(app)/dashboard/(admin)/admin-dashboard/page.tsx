"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ClipboardPen,
  FileText,
  HeartHandshake,
  HeartPulse,
  Mars,
  Venus,
} from "lucide-react"
import {
  DollarSign,
  Users,
  Clock,
  UserCog,
  UserCheck,
  TrendingUp,
  UserPlus,
  TrendingDown,
} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Placeholder data for cards
const dashboardCategories = {
  "Financial Overview": [
    {
      title: "Total Revenue",
      value: "฿174,925.58",
      change: "+20.1% from last month",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Net Profit",
      value: "฿147430.03",
      change: "+15% from last month",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Total Expenses",
      value: "฿27,495.55",
      change: "+5% from last month",
      icon: TrendingDown,
      color: "text-red-500",
    },
    {
      title: "Pending Payments",
      value: "15",
      change: "+3 since last week",
      icon: Clock,
      color: "text-orange-500",
    },
  ],
  "User Metrics": [
    {
      title: "Total Users",
      value: "2,350",
      change: "+180 since last month",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Female Users",
      value: "1,850",
      change: "78% of total",
      icon: Venus,
      color: "text-pink-400",
    },
    {
      title: "Male Users",
      value: "500",
      change: "22% of total",
      icon: Mars, // text-amber-500
      color: "text-amber-500",
    },
    {
      title: "New Users (This Month)",
      value: "+180",
      change: "vs. 150 last month",
      icon: UserPlus,
      color: "text-green-500",
    },
  ],
  "Platform Activity": [
    {
      title: "Registered Interests",
      value: "5,430",
      change: "+250 this week",
      icon: ClipboardPen,
      color: "text-indigo-500",
    },
    {
      title: "Application Forms",
      value: "3,120",
      change: "+150 this week",
      icon: FileText,
      color: "text-lime-500",
    },
    {
      title: "In Matching Process",
      value: "340",
      change: "+5% from last week",
      icon: HeartPulse,
      color: "text-teal-500",
    },
    {
      title: "Matched Users",
      value: "125",
      change: "+12 this month",
      icon: HeartHandshake,
      color: "text-pink-500",
    },
  ],
  Administration: [
    {
      title: "Staff Members",
      value: "45",
      change: "No change",
      icon: UserCog,
      color: "text-purple-500",
    },
    {
      title: "Admins",
      value: "5",
      change: "No change",
      icon: UserCheck,
      color: "text-red-500",
    },
  ],
}

// Placeholder data for charts
const monthlyRevenueData = [
  { month: "Jan", revenue: 18000 },
  { month: "Feb", revenue: 20000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 25000 },
  { month: "May", revenue: 28000 },
  { month: "Jun", revenue: 30000 },
  { month: "Jul", revenue: 32000 },
  { month: "Aug", revenue: 35000 },
  { month: "Sep", revenue: 38000 },
  { month: "Oct", revenue: 40000 },
  { month: "Nov", revenue: 42000 },
  { month: "Dec", revenue: 45000 },
]

const userRoleDistribution = [
  { name: "Users", value: 2350, color: "#8884d8" },
  { name: "Staff", value: 45, color: "#82ca9d" },
  { name: "Admins", value: 5, color: "#ffc658" },
]

const paymentStatusData = [
  { name: "Completed", value: 850, color: "#00C49F" },
  { name: "Pending", value: 15, color: "#FFBB28" },
  { name: "Failed", value: 5, color: "#FF8042" },
]

const genderDistributionData = [
  { name: "Female", value: 1850, color: "#f472b6" }, // text-pink-400
  { name: "Male", value: 500, color: "#FFD700" }, // gold
]

const userActivityData = [
  { name: "Registered Interests", value: 5430, color: "#6366f1" }, // text-indigo-500
  { name: "Application Forms", value: 3120, color: "#84cc16" }, // text-lime-500
  { name: "In Matching Process", value: 340, color: "#14b8a6" }, // text-teal-500
  { name: "Matched Users", value: 125, color: "#ec4899" }, // text-pink-500
]

const RADIAN = Math.PI / 180

export default function AdminDashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, Admin!</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your platform&apos;s key metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Potentially add filters or action buttons here */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="space-y-6">
        {Object.entries(dashboardCategories).map(([category, stats]) => (
          <div key={category}>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              {category}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${stat.title === "Net Profit" ? stat.color : ""}`}
                    >
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Revenue generated over the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "#00C49F" },
              }}
              className="aspect-video h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyRevenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false} // Hides the small ticks on the axis
                    axisLine={false} // Hides the axis line
                    tickMargin={8} // Adds space between ticks and labels
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `฿${Number(value) / 1000}k`}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 xl:col-span-2">
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>
              Breakdown of users by their assigned roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-0">
            <ChartContainer config={{}} className="aspect-square h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      // midAngle is possibly undefined
                      if (midAngle === undefined || percent === undefined) {
                        return null // Don't render label if midAngle or percent is undefined
                      }
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5
                      const x = cx + radius * Math.cos(-midAngle * RADIAN)
                      const y = cy + radius * Math.sin(-midAngle * RADIAN)
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      )
                    }}
                  >
                    {userRoleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 xl:col-span-2">
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Breakdown of users by gender.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-0">
            <ChartContainer config={{}} className="aspect-square h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => {
                      if (name === undefined || percent === undefined) {
                        return null
                      }
                      return `${name} ${(percent * 100).toFixed(0)}%`
                    }}
                  >
                    {genderDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-7 xl:col-span-4">
          <CardHeader>
            <CardTitle>Payment Status Overview</CardTitle>
            <CardDescription>Current status of all payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Count", color: "hsl(var(--chart-2))" },
              }}
              className="aspect-video h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={paymentStatusData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[4, 4, 0, 0]}
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-7 xl:col-span-6">
          <CardHeader>
            <CardTitle>User Activity Funnel</CardTitle>
            <CardDescription>
              Progression of users through the platform stages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "User Count" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Legend />
                  <Bar dataKey="value" name="User Count">
                    {userActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
