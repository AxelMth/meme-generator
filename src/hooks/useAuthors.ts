import { useQuery } from "@tanstack/react-query";
import { useAuthToken } from "../contexts/useAuthentication";
import { getUsersByIds, GetUserByIdResponse } from "../api";

export const useUsersByIds = (ids: string[]): { users: GetUserByIdResponse[] | undefined, isLoading: boolean, error: Error | null } => {
  const token = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", ids],
    queryFn: async () => {
      return await getUsersByIds(token, ids);
    },
  });
  return { users: data, isLoading, error };
};