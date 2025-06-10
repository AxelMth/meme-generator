import { useQuery } from "@tanstack/react-query";
import { useAuthToken } from "../contexts/useAuthentication";
import { GetMemeCommentsResponse, getMemeComments as getMemeCommentsApi } from "../api";

type UseMemeCommentsResponse = {
  comments: GetMemeCommentsResponse["results"];
  isLoading: boolean;
  error: Error | null;
}

export const useMemeComments = (memeId: string | null): UseMemeCommentsResponse => {
  const token = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ["memeComments", memeId],
    queryFn: async () => {
      if (!memeId) {
        return []
      }
      // TODO: implement pagination
      const { results } = await getMemeCommentsApi(token, memeId, 1);
      return results;
    },
    enabled: !!memeId,
  });
  return { comments: data ?? [], isLoading, error };
};