"use client"

export default function MyTrackingPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage all staff stuff
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
    </main>
  )
}
