"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import {
  Folder,
  FolderPlus,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  Download,
  Eye,
  UploadCloud,
  Plus,
  ChevronRight,
  HardDrive,
  Loader2,
  Search,
  Pencil,
  FolderOpen,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/date"
import { useAuthStore } from "@/stores/auth-store"

type ProfileFolder = {
  id: string
  name: string
  profileId: string
  createdAt: string
  _count?: {
    files: number
  }
}

type ProfileFile = {
  id: string
  name: string
  url: string
  r2Key: string
  size: number
  mimeType: string
  folderId: string | null
  profileId: string
  uploadedBy?: string | null
  createdAt: string
}

const FOLDER_PRESETS = [
  "Passports & IDs",
  "Legal & Contracts",
  "Verification & Background",
  "Photos & Media",
]

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const isImageFile = (mimeType: string, fileName: string) => {
  if (mimeType.startsWith("image/")) return true
  const ext = fileName.split(".").pop()?.toLowerCase() || ""
  return ["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(ext)
}

const isPdfFile = (mimeType: string, fileName: string) => {
  if (mimeType === "application/pdf") return true
  return fileName.toLowerCase().endsWith(".pdf")
}

export function ProfileStorageTab({ profileId }: { profileId: string }) {
  const { user } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folders, setFolders] = useState<ProfileFolder[]>([])
  const [files, setFiles] = useState<ProfileFile[]>([])
  const [totalSize, setTotalSize] = useState(0)

  // Loading states for actions
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isRenamingFolder, setIsRenamingFolder] = useState(false)
  const [isRenamingFile, setIsRenamingFile] = useState(false)
  const [isDeletingFile, setIsDeletingFile] = useState(false)
  const [isDeletingFolder, setIsDeletingFolder] = useState(false)

  // Active navigation
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Modals & Actions
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const [renameFolderItem, setRenameFolderItem] =
    useState<ProfileFolder | null>(null)
  const [renameFolderName, setRenameFolderName] = useState("")

  const [renameFileItem, setRenameFileItem] = useState<ProfileFile | null>(null)
  const [renameFileName, setRenameFileName] = useState("")

  const [previewFile, setPreviewFile] = useState<ProfileFile | null>(null)
  const [deleteFileItem, setDeleteFileItem] = useState<ProfileFile | null>(null)
  const [deleteFolderItem, setDeleteFolderItem] =
    useState<ProfileFolder | null>(null)

  const fetchStorageData = useCallback(async () => {
    try {
      const res = await fetch(`/api/profiles/${profileId}/storage`)
      if (!res.ok) throw new Error("Failed to fetch storage")
      const data = await res.json()
      setFolders(data.folders || [])
      setFiles(data.files || [])
      setTotalSize(data.totalSize || 0)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load profile storage.")
    } finally {
      setLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      try {
        const res = await fetch(`/api/profiles/${profileId}/storage`)
        if (!res.ok) throw new Error("Failed to fetch storage")
        const data = await res.json()
        if (isMounted) {
          setFolders(data.folders || [])
          setFiles(data.files || [])
          setTotalSize(data.totalSize || 0)
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          toast.error("Failed to load profile storage.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (profileId) {
      loadInitialData()
    }

    return () => {
      isMounted = false
    }
  }, [profileId])

  const handleCreateFolder = async (folderName?: string) => {
    const nameToUse = folderName || newFolderName
    if (!nameToUse.trim()) {
      toast.error("Please enter a folder name.")
      return
    }

    try {
      setIsCreatingFolder(true)
      const res = await fetch(`/api/profiles/${profileId}/storage/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameToUse.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create folder.")
      }

      toast.success(`Folder "${data.folder.name}" created.`)
      setNewFolderName("")
      setNewFolderDialogOpen(false)
      fetchStorageData()
    } catch (error: any) {
      toast.error(error.message || "Failed to create folder.")
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleRenameFolder = async () => {
    if (!renameFolderItem || !renameFolderName.trim()) return

    try {
      setIsRenamingFolder(true)
      const res = await fetch(
        `/api/profiles/${profileId}/storage/folders/${renameFolderItem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: renameFolderName.trim() }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to rename folder.")

      toast.success(`Folder renamed to "${data.folder.name}".`)
      setRenameFolderItem(null)
      setRenameFolderName("")
      fetchStorageData()
    } catch (error: any) {
      toast.error(error.message || "Failed to rename folder.")
    } finally {
      setIsRenamingFolder(false)
    }
  }

  const handleRenameFile = async () => {
    if (!renameFileItem || !renameFileName.trim()) return

    try {
      setIsRenamingFile(true)
      const res = await fetch(
        `/api/profiles/${profileId}/storage/files/${renameFileItem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: renameFileName.trim() }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to rename file.")

      toast.success(`File renamed to "${data.file.name}".`)
      setRenameFileItem(null)
      setRenameFileName("")
      fetchStorageData()
    } catch (error: any) {
      toast.error(error.message || "Failed to rename file.")
    } finally {
      setIsRenamingFile(false)
    }
  }

  const handleDeleteFolder = async () => {
    if (!deleteFolderItem) return

    try {
      setIsDeletingFolder(true)
      const res = await fetch(
        `/api/profiles/${profileId}/storage/folders/${deleteFolderItem.id}`,
        { method: "DELETE" }
      )

      if (!res.ok) throw new Error("Failed to delete folder.")

      toast.success(`Folder "${deleteFolderItem.name}" deleted.`)
      if (activeFolderId === deleteFolderItem.id) {
        setActiveFolderId(null)
      }
      setDeleteFolderItem(null)
      fetchStorageData()
    } catch (error) {
      toast.error("Failed to delete folder.")
    } finally {
      setIsDeletingFolder(false)
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    try {
      setUploading(true)
      let uploadSuccessCount = 0

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append("file", file)
        if (activeFolderId) {
          formData.append("folderId", activeFolderId)
        }
        if (user?.name) {
          formData.append("uploadedBy", user.name)
        }

        const res = await fetch(`/api/profiles/${profileId}/storage`, {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          uploadSuccessCount++
        }
      }

      if (uploadSuccessCount > 0) {
        toast.success(
          `Uploaded ${uploadSuccessCount} file(s) to secure storage.`
        )
        fetchStorageData()
      } else {
        toast.error("Failed to upload file(s).")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred during file upload.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteFile = async () => {
    if (!deleteFileItem) return

    try {
      setIsDeletingFile(true)
      const res = await fetch(
        `/api/profiles/${profileId}/storage/files/${deleteFileItem.id}`,
        { method: "DELETE" }
      )

      if (!res.ok) throw new Error("Failed to delete file.")

      toast.success(`File "${deleteFileItem.name}" deleted successfully.`)
      setDeleteFileItem(null)
      fetchStorageData()
    } catch (error) {
      toast.error("Failed to delete file.")
    } finally {
      setIsDeletingFile(false)
    }
  }

  const activeFolder = folders.find((f) => f.id === activeFolderId)

  // Filter files by active folder and search
  const filteredFiles = files.filter((file) => {
    const matchesFolder = activeFolderId
      ? file.folderId === activeFolderId
      : true
    const matchesSearch = searchQuery
      ? file.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesFolder && matchesSearch
  })

  // Presets that don't exist yet
  const availablePresets = FOLDER_PRESETS.filter(
    (preset) =>
      !folders.some((f) => f.name.toLowerCase() === preset.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Storage Header Card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-gradient flex items-center gap-2 text-xl font-bold">
                <HardDrive className="h-5 w-5 text-primary" />
                Secure Storage
              </CardTitle>
              <CardDescription className="mt-1 text-xs text-muted-foreground">
                Secure storage for passports, contracts, ID scans, and
                documents.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="px-3 py-1 font-mono text-xs"
              >
                {files.length} {files.length === 1 ? "file" : "files"} •{" "}
                {formatFileSize(totalSize)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setNewFolderDialogOpen(true)}
              >
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
              <Button
                size="sm"
                className="btn-gradient gap-1.5"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Suggested Quick Folder Presets */}
      {availablePresets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Quick folders:
          </span>
          {availablePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleCreateFolder(preset)}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-3 w-3" />
              {preset}
            </button>
          ))}
        </div>
      )}

      {/* Folders Grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Folders</h3>
          {activeFolderId && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setActiveFolderId(null)}
            >
              View All Files
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))
          ) : (
            <>
              {/* All Files "Root" Folder Card */}
              <div
                onClick={() => setActiveFolderId(null)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                  activeFolderId === null
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border/60 bg-card hover:border-border hover:bg-accent/40"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FolderOpen
                    className={`h-5 w-5 shrink-0 ${
                      activeFolderId === null
                        ? "text-primary"
                        : "text-amber-500"
                    }`}
                  />
                  <div className="truncate">
                    <p className="truncate text-xs font-semibold text-foreground">
                      All Files
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {files.length} items
                    </p>
                  </div>
                </div>
              </div>

              {/* User Folders */}
              {folders.map((folder) => {
                const folderFilesCount = files.filter(
                  (f) => f.folderId === folder.id
                ).length
                const isSelected = activeFolderId === folder.id

                return (
                  <div
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/60 bg-card hover:border-border hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                      <Folder
                        className={`h-5 w-5 shrink-0 ${
                          isSelected ? "text-primary" : "text-amber-500"
                        }`}
                      />
                      <div className="truncate">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {folder.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {folderFilesCount}{" "}
                          {folderFilesCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        title="Rename Folder"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRenameFolderItem(folder)
                          setRenameFolderName(folder.name)
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Delete Folder"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteFolderItem(folder)
                        }}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Files Section */}
      <div className="space-y-3">
        {/* Navigation & Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setActiveFolderId(null)}
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Storage
            </button>
            {activeFolder && (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {activeFolder.name}
                </span>
              </>
            )}
            <span className="text-xs text-muted-foreground">
              ({filteredFiles.length}{" "}
              {filteredFiles.length === 1 ? "file" : "files"})
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col justify-between space-y-3 overflow-hidden rounded-xl border border-border/60 bg-card p-3 shadow-xs"
              >
                <Skeleton className="h-28 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2">
                  <Skeleton className="h-7 w-16 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          /* Empty State / Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 p-12 text-center transition-colors hover:border-primary/60 hover:bg-muted/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-foreground">
              {activeFolder
                ? `No files in "${activeFolder.name}"`
                : "No files stored yet"}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Click to upload passports, documents, or photos to secure storage
            </p>
          </div>
        ) : (
          /* Files Grid */
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredFiles.map((file) => {
              const isImage = isImageFile(file.mimeType, file.name)
              const isPdf = isPdfFile(file.mimeType, file.name)
              const folderObj = folders.find((f) => f.id === file.folderId)

              return (
                <div
                  key={file.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-3 shadow-xs transition-all hover:border-border hover:shadow-md"
                >
                  {/* File Preview Area */}
                  <div
                    onClick={() => setPreviewFile(file)}
                    className="relative flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-muted/40 transition-transform group-hover:scale-[1.01]"
                  >
                    {isImage ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : isPdf ? (
                      <div className="flex flex-col items-center justify-center text-red-500">
                        <FileText className="h-10 w-10" />
                        <span className="mt-1 font-mono text-[9px] font-bold uppercase">
                          PDF
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <File className="h-10 w-10" />
                        <span className="mt-1 font-mono text-[9px] font-bold uppercase">
                          {file.name.split(".").pop() || "FILE"}
                        </span>
                      </div>
                    )}

                    {/* Quick Preview Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-black shadow-xs">
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </span>
                    </div>
                  </div>

                  {/* File Metadata */}
                  <div className="mt-2.5">
                    <p
                      className="truncate text-xs font-semibold text-foreground"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {folderObj && (
                        <span className="truncate rounded-md bg-muted px-1.5 py-0.5 font-medium">
                          {folderObj.name}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">
                      {formatDateTime(file.createdAt)}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="Download"
                        asChild
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="Rename File"
                        onClick={() => {
                          setRenameFileItem(file)
                          setRenameFileName(file.name)
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Delete File"
                      onClick={() => setDeleteFileItem(file)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Organize documents for this profile (e.g. Passports, Contracts,
              IDs).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="e.g. Passports & Visas"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleCreateFolder()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isCreatingFolder}
              onClick={() => setNewFolderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn-gradient"
              disabled={isCreatingFolder}
              onClick={() => handleCreateFolder()}
            >
              {isCreatingFolder ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Folder"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog
        open={!!renameFolderItem}
        onOpenChange={(open) => !open && setRenameFolderItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for folder &quot;{renameFolderItem?.name}&quot;.
              Duplicate names will be auto-incremented.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="New folder name"
              value={renameFolderName}
              onChange={(e) => setRenameFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleRenameFolder()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isRenamingFolder}
              onClick={() => setRenameFolderItem(null)}
            >
              Cancel
            </Button>
            <Button
              className="btn-gradient"
              disabled={isRenamingFolder}
              onClick={handleRenameFolder}
            >
              {isRenamingFolder ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Name"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog
        open={!!renameFileItem}
        onOpenChange={(open) => !open && setRenameFileItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for &quot;{renameFileItem?.name}&quot;. Duplicate
              names will be auto-incremented.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="New file name"
              value={renameFileName}
              onChange={(e) => setRenameFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleRenameFile()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isRenamingFile}
              onClick={() => setRenameFileItem(null)}
            >
              Cancel
            </Button>
            <Button
              className="btn-gradient"
              disabled={isRenamingFile}
              onClick={handleRenameFile}
            >
              {isRenamingFile ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Name"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      >
        <DialogContent className="flex !h-[92vh] !max-h-[92vh] !w-[96vw] !max-w-6xl flex-col overflow-hidden rounded-2xl border bg-card p-0 shadow-2xl">
          {previewFile && (
            <div className="flex h-full w-full flex-col">
              {/* Modal Header */}
              <div className="flex shrink-0 items-center justify-between border-b bg-card py-3.5 pr-14 pl-5">
                <div className="truncate pr-4">
                  <h4 className="truncate text-base font-bold text-foreground">
                    {previewFile.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatFileSize(previewFile.size)} •{" "}
                    {formatDateTime(previewFile.createdAt)}
                    {previewFile.uploadedBy && (
                      <span> • Uploaded by {previewFile.uploadedBy}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="btn-gradient h-8 gap-1.5 text-xs font-medium shadow-xs"
                    asChild
                  >
                    <a
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  </Button>
                </div>
              </div>

              {/* Modal Body / Viewer Area */}
              <div className="relative flex flex-1 items-center justify-center overflow-auto bg-neutral-900/10 p-4 dark:bg-black/60">
                {isImageFile(previewFile.mimeType, previewFile.name) ? (
                  <div className="relative flex h-full w-full items-center justify-center overflow-auto p-2">
                    <Image
                      src={previewFile.url}
                      alt={previewFile.name}
                      fill
                      unoptimized
                      priority
                      className="object-contain"
                      sizes="95vw"
                    />
                  </div>
                ) : isPdfFile(previewFile.mimeType, previewFile.name) ? (
                  <iframe
                    src={previewFile.url}
                    title={previewFile.name}
                    className="h-full w-full rounded-xl border border-border/60 bg-white shadow-xs"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                      <File className="h-10 w-10" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-foreground">
                      {previewFile.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Direct in-app preview is not supported for this file
                      format ({previewFile.mimeType}).
                    </p>
                    <div className="mt-5 flex items-center justify-center">
                      <Button className="btn-gradient gap-1.5" asChild>
                        <a
                          href={previewFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="h-4 w-4" /> Download File
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete File Confirmation */}
      <AlertDialog
        open={!!deleteFileItem}
        onOpenChange={(open) => !open && setDeleteFileItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong className="font-semibold text-foreground">
                {deleteFileItem?.name}
              </strong>
              ? This will permanently delete the file from storage and remove
              its database record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingFile}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingFile}
              className="hover:bg-destructive/90"
              onClick={handleDeleteFile}
            >
              {isDeletingFile ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Folder Confirmation */}
      <AlertDialog
        open={!!deleteFolderItem}
        onOpenChange={(open) => !open && setDeleteFolderItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete folder{" "}
              <strong className="font-semibold text-foreground">
                {deleteFolderItem?.name}
              </strong>
              ? Any files inside will be preserved and moved to All Files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingFolder}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingFolder}
              className="hover:bg-destructive/90"
              onClick={handleDeleteFolder}
            >
              {isDeletingFolder ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Folder"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
