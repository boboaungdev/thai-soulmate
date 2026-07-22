"use client"

import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

type RegisterInterest = {
  id: string
  prefix: string
  name: string
  dob: string
  gender: string
  nationality: string
  currentLocation: string
  email: string
  phoneCountry: string
  phone: string
  source: string
  otherSource?: string | null
  createdAt: string
}

export default function RegisterInterestPage() {
  const [users, setUsers] = useState<RegisterInterest[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function fetchUsers() {
    setLoading(true)

    try {
      const res = await fetch(`/api/register-interest?page=${page}&limit=10`)

      const result = await res.json()

      if (result.success) {
        setUsers(result.data)

        setTotalPages(result.pagination.totalPages)
      }
    } catch (error) {
      console.error("Fetch register interests error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Register Interest</h1>

        <p className="text-sm text-muted-foreground">
          Users who submitted matchmaking interest forms
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({
            length: 5,
          }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No registrations found.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}

          <div className="hidden rounded-lg border md:block">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>

                    <TableHead>Gender</TableHead>

                    <TableHead>Nationality</TableHead>

                    <TableHead>Location</TableHead>

                    <TableHead>Email</TableHead>

                    <TableHead>Phone</TableHead>

                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>

                      <TableCell>
                        <Badge variant="outline">{user.gender}</Badge>
                      </TableCell>

                      <TableCell>{user.nationality}</TableCell>

                      <TableCell>{user.currentLocation}</TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>
                        {user.phoneCountry} {user.phone}
                      </TableCell>

                      <TableCell>{user.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Mobile Cards */}

          <div className="grid gap-4 md:hidden">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">
                      {user.prefix} {user.name}
                    </h2>

                    <Badge>{user.gender}</Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>🌍 {user.nationality}</p>

                    <p>📍 {user.currentLocation}</p>

                    <p>✉️ {user.email}</p>

                    <p>
                      📞 {user.phoneCountry} {user.phone}
                    </p>

                    <p>Source: {user.source}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()

                    setPage((prev) => Math.max(1, prev - 1))
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

                      className={`rounded-md px-3 py-2 text-sm ${
                        page === pageNumber ? "bg-secondary" : "hover:bg-muted"
                      } `}
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

                    setPage((prev) => Math.min(totalPages, prev + 1))
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
