import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { getMemes, GetMemesResponse } from '../api';
import { Meme } from '../types/meme';

type UseMemesResponse = {
  memes: Meme[];
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
};

export const useMemes = (): UseMemesResponse => {
  const token = useAuthToken();
  const { data, isLoading, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['memes'],
    queryFn: async ({ pageParam = 1 }) => {
      const { results, total, pageSize } = await getMemes(token, pageParam);
      return { results: results, total, pageSize };
    },
    getNextPageParam: (_lastPage, _pages, previousPageParam) => previousPageParam + 1,
    initialPageParam: 1,
  });
  return {
    memes: data?.pages.flatMap((page) => page.results).map(mapMeme) ?? [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  };
};

function mapMeme(meme: GetMemesResponse['results'][0]): Meme {
  return {
    ...meme,
    commentsCount: +meme.commentsCount,
  };
}
