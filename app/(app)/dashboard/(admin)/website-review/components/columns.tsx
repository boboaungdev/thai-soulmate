
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type WebsiteReview } from '@prisma/client';

export const columns: ColumnDef<WebsiteReview>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'design',
    header: 'Design Rating',
  },
  {
    accessorKey: 'registration',
    header: 'Registration Process Rating',
  },
  {
    accessorKey: 'createdAt',
    header: 'Submitted At',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
];
