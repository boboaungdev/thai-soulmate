"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { AddUserSheet } from "./add-user-sheet"
import { columns, User } from "./columns"
import { DataTable } from "./data-table"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)

      try {
        const res = await fetch(`/api/users?limit=100`)
        const json = await res.json()

        if (json.success) {
          setUsers(json.data)
        }
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleUserAdded = (newUser: User) => {
    setUsers((prevUsers) => [newUser, ...prevUsers])
  }

  return (
    <>
      <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Login User</h1>
            <p className="text-sm text-muted-foreground">Manage login users</p>
          </div>
          <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
            Add User
          </Button>
        </div>

        {loading ? (
          <Skeleton className="h-96 w-full rounded-lg" />
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </main>
      <AddUserSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onUserAdded={handleUserAdded}
      />
    </>
  )
}
