import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { useAuthToken } from '../contexts/useAuthentication';
import { GetMemeCommentsResponse, getMemeComments as getMemeCommentsApi } from '../api';

type UseMemeCommentsResponse = {
  comments: GetMemeCommentsResponse['results'];
  isLoading: boolean;
  error: Error | null;
  fetchNextComments: () => void;
  hasNextComments: boolean;
};

export const useMemeComments = (memeId: string | null): UseMemeCommentsResponse => {
  const token = useAuthToken();

  const initialPage = 1;
  const initialTotal = 0;

  const [comments, setComments] = useState<GetMemeCommentsResponse['results']>([]);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);

  useEffect(() => {
    setComments([]);
    setPage(initialPage);
    setTotal(initialTotal);
  }, [memeId]);

  const { isLoading, error } = useQuery({
    queryKey: ['memeComments', memeId, page],
    queryFn: async () => {
      if (!memeId) {
        return [];
      }
      const { results, total } = await getMemeCommentsApi(token, memeId, page);
      setComments((prev) => [...prev, ...results]);
      setTotal(total);
      return results;
    },
    enabled: !!memeId,
  });

  const fetchNextPage = () => {
    console.log('fetchNextPage', comments.length, total);
    if (comments.length < total) {
      setPage(page + 1);
    }
  };

  return { comments, isLoading, error, fetchNextComments: fetchNextPage, hasNextComments: comments.length < total };
};
