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
  Users,
  UserPlus,
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
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

// Placeholder data for cards
const platformActivityStats = [
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
]

const userMetrics = [
  {
    title: "Total Users",
    value: "2,350",
    change: "+180 since last month",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "New Users (This Month)",
    value: "+180",
    change: "vs. 150 last month",
    icon: UserPlus,
    color: "text-green-500",
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
    icon: Mars,
    color: "text-amber-500",
  },
]

// Placeholder data for charts
const monthlyApplicationsData = [
  { month: "Jan", total: 450 },
  { month: "Feb", total: 480 },
  { month: "Mar", total: 520 },
  { month: "Apr", total: 580 },
  { month: "May", total: 620 },
  { month: "Jun", total: 670 },
  { month: "Jul", total: 710 },
  { month: "Aug", total: 730 },
  { month: "Sep", total: 700 },
  { month: "Oct", total: 750 },
  { month: "Nov", total: 800 },
  { month: "Dec", total: 850 },
]

const applicationStatusData = [
  { name: "Approved", value: 1500, color: "#00C49F" },
  { name: "Pending", value: 800, color: "#FFBB28" },
  { name: "Rejected", value: 320, color: "#FF8042" },
  { name: "Needs Info", value: 500, color: "#8884d8" },
]

const genderDistributionData = [
  { name: "Female", value: 1850, color: "#f472b6" },
  { name: "Male", value: 500, color: "#FFD700" },
]

const userActivityData = [
  { name: "Registered Interests", value: 5430, color: "#6366f1" },
  { name: "Application Forms", value: 3120, color: "#84cc16" },
  { name: "In Matching Process", value: 340, color: "#14b8a6" },
  { name: "Matched Users", value: 125, color: "#ec4899" },
]

const RADIAN = Math.PI / 180

export default function StaffDashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, Staff Member!
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of the platform activity.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            User Metrics
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {userMetrics.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Platform Activity
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {platformActivityStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>New Applications</CardTitle>
            <CardDescription>
              New applications over the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                total: { label: "Applications", color: "#84cc16" },
              }}
              className="aspect-video h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyApplicationsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toString()}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
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
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Breakdown of all application statuses.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-0">
            <ChartContainer config={{}} className="aspect-square h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationStatusData}
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
                      if (midAngle === undefined || percent === undefined) {
                        return null
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
                    {applicationStatusData.map((entry, index) => (
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
                  <Bar dataKey="value" name="User Count" barSize={35}>
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
