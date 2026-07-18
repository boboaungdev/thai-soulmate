"use client"

import { useEffect, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type User = {
  id: string
  name: string
  email: string
  avatar: string | null
  role: "ADMIN" | "STAFF" | "USER"
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function loadUsers() {
    setLoading(true)

    try {
      const res = await fetch(`/api/users?page=${page}&limit=10`)

      const json = await res.json()

      if (json.success) {
        setUsers(json.data)
        setTotalPages(json.pagination.totalPages)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page])

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>

        <p className="text-sm text-muted-foreground">Manage registered users</p>
      </div>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-lg" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar ?? ""} />

                            <AvatarFallback>
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {users.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No users found
              </p>
            ) : (
              users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar ?? ""} />

                        <AvatarFallback>
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">{user.name}</p>

                        <p className="truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge>{user.role}</Badge>

                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({
                length: totalPages,
              }).map((_, index) => {
                const pageNumber = index + 1

                return (
                  <PaginationItem key={pageNumber}>
                    <button
                      onClick={() => setPage(pageNumber)}
                      className={`rounded-md px-3 py-2 text-sm transition ${
                        page === pageNumber ? "bg-secondary" : "hover:bg-muted"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </main>
  )
}
