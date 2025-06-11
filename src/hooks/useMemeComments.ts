import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { GetMemeCommentsResponse, getMemeComments as getMemeCommentsApi } from '../api';
import { Comment } from '../types/comment';

export const useMemeComments = (memeId: string | null): UseMemeCommentsResponse => {
  const token = useAuthToken();
  const queryClient = useQueryClient();

  const [comments, setComments] = useState<GetMemeCommentsResponse['results']>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { isLoading, error } = useQuery({
    queryKey: ['memeComments', memeId, page],
    queryFn: async () => {
      if (!memeId) {
        return [];
      }
      const { results, total } = await getMemeCommentsApi(token, memeId, page);
      setTotal(total);
      return { results, total };
    },
    enabled: !!memeId,
  });

  useEffect(() => {
    if (isLoading || !memeId) return;

    const queryData = queryClient.getQueryData(['memeComments', memeId, page]);
    if (!queryData) return;

    const { results } = queryData as { results: GetMemeCommentsResponse['results'] };
    setComments((prev) => {
      const newComments = [...prev, ...results];
      const uniqueComments = newComments.filter(
        (comment, index, self) => index === self.findIndex((t) => t.id === comment.id)
      );
      return uniqueComments;
    });
  }, [isLoading, memeId, page, queryClient]);

  const hasNextComments = useMemo(() => comments.length < total, [comments.length, total]);
  const fetchNextPage = useCallback(() => {
    if (hasNextComments) {
      setPage(page + 1);
    }
  }, [hasNextComments, page]);

  const addComment = useCallback(
    (comment: GetMemeCommentsResponse['results'][0]) => {
      setComments((prev) => [...prev, comment]);
      setTotal(total + 1);
    },
    [total, setComments, setTotal]
  );

  return {
    comments,
    commentsCount: total,
    isLoading,
    error,
    fetchNextComments: fetchNextPage,
    hasNextComments,
    addComment,
  };
};

type UseMemeCommentsResponse = {
  comments: Comment[];
  commentsCount: number;
  isLoading: boolean;
  error: Error | null;
  fetchNextComments: () => void;
  hasNextComments: boolean;
  addComment: (comment: GetMemeCommentsResponse['results'][0]) => void;
};
