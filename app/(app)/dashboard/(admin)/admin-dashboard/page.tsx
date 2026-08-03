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
  CreditCard,
  Mail,
  MailQuestion,
  MailCheck,
  MailX,
} from "lucide-react"
import {
  DollarSign,
  Clock,
  UserCog,
  UserCheck,
  TrendingUp,
  Users2,
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
  ],
  "Registered Interest": [
    {
      title: "Interest Received",
      value: "5,430",
      change: "+250 this month",
      icon: Mail,
      color: "text-indigo-500",
    },
    {
      title: "Interest Pending",
      value: "200",
      change: "+10 since yesterday",
      icon: MailQuestion,
      color: "text-orange-500",
    },
    {
      title: "Interest Accepted",
      value: "4,800",
      change: "+200 this month",
      icon: MailCheck,
      color: "text-green-500",
    },
    {
      title: "Interest Declined",
      value: "430",
      change: "+40 this month",
      icon: MailX,
      color: "text-red-500",
    },
  ],
  "Application Form": [
    {
      title: "Apps Received",
      value: "3,120",
      change: "+150 this month",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Apps Pending",
      value: "150",
      change: "-5 since yesterday",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Apps Completed",
      value: "2,970",
      change: "+155 this month",
      icon: UserCheck,
      color: "text-green-500",
    },
  ],
  Payment: [
    {
      title: "Payment Pending",
      value: "15",
      change: "+3 this month",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Payment Completed",
      value: "850",
      change: "+50 this month",
      icon: UserCheck,
      color: "text-green-500",
    },
  ],
  Profiles: [
    {
      title: "Profiles Pending",
      value: "80",
      change: "Needs review",
      icon: UserCog,
      color: "text-yellow-500",
    },
    {
      title: "Profiles Completed",
      value: "2,890",
      change: "Ready for matching",
      icon: Users2,
      color: "text-teal-500",
    },
  ],
  Matching: [
    {
      title: "Profiles Matched",
      value: "125",
      change: "+12 this month",
      icon: HeartHandshake,
      color: "text-pink-500",
    },
    {
      title: "Profiles Pending",
      value: "340",
      change: "+5% from last month",
      icon: HeartPulse,
      color: "text-teal-500",
    },
    {
      title: "Awaiting Confirmation",
      value: "75",
      change: "Needs member action",
      icon: UserCheck,
      color: "text-yellow-500",
    },
    {
      title: "Total Matches Initiated",
      value: "465",
      change: "+20 this month",
      icon: HeartPulse, // Reusing HeartPulse for this
      color: "text-blue-500",
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

const genderDistributionData = [
  { name: "Female", value: 1850, color: "#f472b6" }, // text-pink-400
  { name: "Male", value: 500, color: "#FFD700" }, // gold
]

const userActivityData = [
  { name: "Registered Interests", value: 5430, color: "#6366f1" }, // text-indigo-500
  { name: "Application Forms", value: 3120, color: "#84cc16" }, // text-lime-500
  { name: "In Matching Process", value: 340, color: "#14b8a6" }, // text-teal-500
  { name: "Matched Members", value: 125, color: "#ec4899" }, // text-pink-500
]

const categoryIcons: { [key: string]: React.ElementType } = {
  "Financial Overview": DollarSign,
  "Registered Interest": ClipboardPen,
  "Application Form": FileText,
  Payment: CreditCard,
  Profiles: Users2,
  Matching: HeartHandshake,
}

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
        {Object.entries(dashboardCategories).map(([category, stats]) => {
          const Icon = categoryIcons[category]
          return (
            <div key={category}>
              <h2 className="mb-4 flex items-center text-xl font-semibold tracking-tight">
                {Icon && <Icon className="mr-2 h-5 w-5" />}
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
                        className={`text-2xl font-bold ${
                          stat.title === "Net Profit" ? stat.color : ""
                        }`}
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
          )
        })}
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
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Breakdown of members by gender.</CardDescription>
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
                  >
                    {genderDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-sm font-semibold"
                  >
                    Total Members
                  </text>
                  <text
                    x="50%"
                    y="58%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-2xl font-bold"
                  >
                    {genderDistributionData.reduce(
                      (acc, curr) => acc + curr.value,
                      0
                    )}
                  </text>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend
                    content={({ payload }) => {
                      return (
                        <div className="flex items-center justify-center gap-4">
                          {payload?.map((entry) => (
                            <div
                              key={entry.value}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-7 xl:col-span-6">
          <CardHeader>
            <CardTitle>Member Activity Funnel</CardTitle>
            <CardDescription>
              Progression of members through the platform stages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Member Count" },
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
                  <Bar dataKey="value">
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
