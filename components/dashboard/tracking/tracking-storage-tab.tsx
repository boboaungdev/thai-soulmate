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

type TrackingFolder = {
  id: string
  name: string
  trackingId: string
  createdAt: string
  _count?: {
    files: number
  }
}

type TrackingFile = {
  id: string
  name: string
  url: string
  r2Key: string
  size: number
  mimeType: string
  folderId: string | null
  trackingId: string
  uploadedBy?: string | null
  createdAt: string
}

const FOLDER_PRESETS = [
  "Meet Recordings & Notes",
  "Matching Reports",
  "Legal & Contracts",
  "Shared Media & Photos",
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

export function TrackingStorageTab({ trackingId }: { trackingId: string }) {
  const { user } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folders, setFolders] = useState<TrackingFolder[]>([])
  const [files, setFiles] = useState<TrackingFile[]>([])
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
    useState<TrackingFolder | null>(null)
  const [renameFolderName, setRenameFolderName] = useState("")

  const [renameFileItem, setRenameFileItem] = useState<TrackingFile | null>(
    null
  )
  const [renameFileName, setRenameFileName] = useState("")

  const [previewFile, setPreviewFile] = useState<TrackingFile | null>(null)
  const [deleteFileItem, setDeleteFileItem] = useState<TrackingFile | null>(
    null
  )
  const [deleteFolderItem, setDeleteFolderItem] =
    useState<TrackingFolder | null>(null)

  const fetchStorageData = useCallback(async () => {
    try {
      const res = await fetch(`/api/tracking/${trackingId}/storage`)
      if (!res.ok) throw new Error("Failed to fetch storage")
      const data = await res.json()
      setFolders(data.folders || [])
      setFiles(data.files || [])
      setTotalSize(data.totalSize || 0)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load tracking storage.")
    } finally {
      setLoading(false)
    }
  }, [trackingId])

  useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      try {
        const res = await fetch(`/api/tracking/${trackingId}/storage`)
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
          toast.error("Failed to load tracking storage.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (trackingId) {
      loadInitialData()
    }

    return () => {
      isMounted = false
    }
  }, [trackingId])

  const handleCreateFolder = async (folderName?: string) => {
    const nameToUse = folderName || newFolderName
    if (!nameToUse.trim()) {
      toast.error("Please enter a folder name.")
      return
    }

    try {
      setIsCreatingFolder(true)
      const res = await fetch(`/api/tracking/${trackingId}/storage/folders`, {
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
        `/api/tracking/${trackingId}/storage/folders/${renameFolderItem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: renameFolderName.trim() }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to rename folder.")
      }

      toast.success("Folder renamed successfully.")
      setRenameFolderItem(null)
      fetchStorageData()
    } catch (error: any) {
      toast.error(error.message || "Failed to rename folder.")
    } finally {
      setIsRenamingFolder(false)
    }
  }

  const handleDeleteFolder = async (deleteFiles = false) => {
    if (!deleteFolderItem) return

    try {
      setIsDeletingFolder(true)
      const res = await fetch(
        `/api/tracking/${trackingId}/storage/folders/${deleteFolderItem.id}?deleteFiles=${deleteFiles}`,
        {
          method: "DELETE",
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete folder.")
      }

      toast.success(data.message || "Folder deleted.")
      if (activeFolderId === deleteFolderItem.id) {
        setActiveFolderId(null)
      }
      setDeleteFolderItem(null)
      fetchStorageData()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete folder.")
    } finally {
      setIsDeletingFolder(false)
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles || uploadedFiles.length === 0) return

    setUploading(true)
    let successCount = 0

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      const formData = new FormData()
      formData.append("file", file)
      if (activeFolderId) {
        formData.append("folderId", activeFolderId)
      }
      if (user?.name) {
        formData.append("uploadedBy", user.name)
      }

      try {
        const res = await fetch(`/api/tracking/${trackingId}/storage`, {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          successCount++
        } else {
          const data = await res.json()
          toast.error(`Failed to upload ${file.name}: ${data.error}`)
        }
      } catch (err) {
        console.error(err)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s).`)
      fetchStorageData()
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRenameFile = async () => {
    if (!renameFileItem || !renameFileName.trim()) return

    try {
      setIsRenamingFile(true)
      const res = await fetch(
        `/api/tracking/${trackingId}/storage/files/${renameFileItem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: renameFileName.trim() }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to rename file.")
      }

      toast.success("File renamed successfully.")
      setRenameFileItem(null)
      fetchStorageData()
    } catch (error: any) {
      toast.error(error.message || "Failed to rename file.")
    } finally {
      setIsRenamingFile(false)
    }
  }

  const handleDeleteFile = async () => {
    if (!deleteFileItem) return

    try {
      setIsDeletingFile(true)
      const res = await fetch(
        `/api/tracking/${trackingId}/storage/files/${deleteFileItem.id}`,
        {
          method: "DELETE",
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete file.")
      }

      toast.success("File deleted successfully.")
      setDeleteFileItem(null)
      fetchStorageData()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete file.")
    } finally {
      setIsDeletingFile(false)
    }
  }

  const handleDownload = async (file: TrackingFile) => {
    try {
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error(e)
      toast.error("Failed to download file.")
    }
  }

  const activeFolder = folders.find((f) => f.id === activeFolderId)

  const displayedFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    if (activeFolderId) {
      return file.folderId === activeFolderId && matchesSearch
    }
    return matchesSearch
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-28" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">
                Tracking Storage
              </CardTitle>
            </div>
            <CardDescription>
              Manage documents, verification media, meeting recordings, and
              files for this tracking journey.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewFolderDialogOpen(true)}
              className="gap-1.5"
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </Button>
            <Button
              size="sm"
              className="btn-gradient gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload File</span>
                </>
              )}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Top Quick Stats & Folder Presets */}
          {folders.length === 0 && files.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Quick Create Recommended Folders
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FOLDER_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => handleCreateFolder(preset)}
                    disabled={isCreatingFolder}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{preset}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Breadcrumb & Search Bar */}
          <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveFolderId(null)}
                className={`flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted ${
                  activeFolderId === null
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <HardDrive className="h-4 w-4" />
                <span>All Files ({files.length})</span>
              </button>

              {activeFolder && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="flex items-center gap-1.5 font-semibold text-primary">
                    <FolderOpen className="h-4 w-4" />
                    <span>{activeFolder.name}</span>
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {formatFileSize(totalSize)}
              </Badge>
            </div>
          </div>

          {/* Folders Grid (shown when in root) */}
          {!activeFolderId && folders.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Folders ({folders.length})
              </span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {folders.map((folder) => {
                  const fileCount = files.filter(
                    (f) => f.folderId === folder.id
                  ).length

                  return (
                    <div
                      key={folder.id}
                      className="group relative flex cursor-pointer items-center justify-between rounded-xl border bg-card p-3 shadow-2xs transition-all hover:border-primary/50 hover:bg-muted/30"
                      onClick={() => setActiveFolderId(folder.id)}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Folder className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {folder.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fileCount} file{fileCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setRenameFolderItem(folder)
                            setRenameFolderName(folder.name)
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteFolderItem(folder)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Files List / Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {activeFolder ? `Files in ${activeFolder.name}` : "Files"} (
                {displayedFiles.length})
              </span>
            </div>

            {displayedFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                <File className="mb-2 h-10 w-10 stroke-1 text-muted-foreground/60" />
                <p className="text-sm font-medium">No files found</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "Upload documents, notes, or media above."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60 overflow-hidden rounded-xl border bg-card">
                {displayedFiles.map((file) => {
                  const isImage = isImageFile(file.mimeType, file.name)
                  const isPdf = isPdfFile(file.mimeType, file.name)

                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          {isImage ? (
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                          ) : isPdf ? (
                            <FileText className="h-5 w-5 text-red-500" />
                          ) : (
                            <File className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">
                              {file.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="px-1 py-0 font-mono text-[10px]"
                            >
                              {formatFileSize(file.size)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {formatDateTime(file.createdAt)}
                            {file.uploadedBy && ` by ${file.uploadedBy}`}
                          </p>
                        </div>
                      </div>

                      <div className="ml-3 flex shrink-0 items-center gap-1">
                        {(isImage || isPdf) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setPreviewFile(file)}
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleDownload(file)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setRenameFileItem(file)
                            setRenameFileName(file.name)
                          }}
                          title="Rename"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteFileItem(file)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new storage folder.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name..."
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewFolderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCreateFolder()}
              disabled={isCreatingFolder || !newFolderName.trim()}
              className="btn-gradient"
            >
              {isCreatingFolder && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog
        open={!!renameFolderItem}
        onOpenChange={(open) => !open && setRenameFolderItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for folder &quot;{renameFolderItem?.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameFolderName}
            onChange={(e) => setRenameFolderName(e.target.value)}
            placeholder="New folder name..."
            onKeyDown={(e) => e.key === "Enter" && handleRenameFolder()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameFolderItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleRenameFolder}
              disabled={isRenamingFolder || !renameFolderName.trim()}
              className="btn-gradient"
            >
              {isRenamingFolder && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog
        open={!!renameFileItem}
        onOpenChange={(open) => !open && setRenameFileItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for file &quot;{renameFileItem?.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameFileName}
            onChange={(e) => setRenameFileName(e.target.value)}
            placeholder="New file name..."
            onKeyDown={(e) => e.key === "Enter" && handleRenameFile()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameFileItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleRenameFile}
              disabled={isRenamingFile || !renameFileName.trim()}
              className="btn-gradient"
            >
              {isRenamingFile && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      >
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col">
          <DialogHeader>
            <DialogTitle className="truncate">{previewFile?.name}</DialogTitle>
            <DialogDescription>
              {previewFile && formatFileSize(previewFile.size)} • Uploaded{" "}
              {previewFile && formatDateTime(previewFile.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="relative my-2 flex min-h-[50vh] w-full flex-1 items-center justify-center overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
            {previewFile &&
            isImageFile(previewFile.mimeType, previewFile.name) ? (
              <Image
                src={previewFile.url}
                alt={previewFile.name}
                fill
                className="object-contain"
              />
            ) : previewFile &&
              isPdfFile(previewFile.mimeType, previewFile.name) ? (
              <iframe
                src={`${previewFile.url}#toolbar=0`}
                className="h-full min-h-[60vh] w-full border-0"
                title={previewFile.name}
              />
            ) : null}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setPreviewFile(null)}>
              Close
            </Button>
            {previewFile && (
              <Button
                onClick={() => handleDownload(previewFile)}
                className="btn-gradient"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete File Confirmation */}
      <AlertDialog
        open={!!deleteFileItem}
        onOpenChange={(open) => !open && setDeleteFileItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &quot;
              {deleteFileItem?.name}&quot; from storage? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
              disabled={isDeletingFile}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              {isDeletingFile ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
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
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              How would you like to delete &quot;{deleteFolderItem?.name}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => handleDeleteFolder(false)}
              disabled={isDeletingFolder}
            >
              Delete Folder Only (Keep Files)
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteFolder(true)}
              disabled={isDeletingFolder}
            >
              Delete Folder & All Files
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
