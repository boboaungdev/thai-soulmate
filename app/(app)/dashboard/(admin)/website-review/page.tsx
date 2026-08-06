
'use client';

import { useEffect } from 'react';
import { useWebsiteReviewStore } from '@/stores/website-review-store';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default function WebsiteReviewPage() {
  const { reviews, loading, error, actions } = useWebsiteReviewStore();

  useEffect(() => {
    actions.fetchReviews();
  }, [actions]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Website Reviews</h1>
      <DataTable columns={columns} data={reviews} />
    </div>
  );
}
