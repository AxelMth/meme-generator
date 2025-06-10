import { useQuery } from "@tanstack/react-query";
import { useAuthToken } from "../contexts/useAuthentication";
import { GetMemeCommentsResponse, getMemeComments as getMemeCommentsApi } from "../api";

export const useMemeComments = (memeId: string): { comments: GetMemeCommentsResponse | undefined, isLoading: boolean, error: Error | null } => {
  const token = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ["memeComments", memeId],
    queryFn: async () => {
      return await getMemeCommentsApi(token, memeId, 1);
    },
  });
  return { comments: data, isLoading, error };
};