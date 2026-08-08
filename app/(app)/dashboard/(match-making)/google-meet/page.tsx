"use client"

export default function GoogleMeetPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Google Meet</h1>
          <p className="text-sm text-muted-foreground">
            All of google meeting list
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
    </main>
  )
}
