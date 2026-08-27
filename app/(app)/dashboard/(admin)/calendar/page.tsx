export default function Calendar() {
  return (
    <>
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <p className="text-sm text-muted-foreground">
              Manage all application tasks
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
