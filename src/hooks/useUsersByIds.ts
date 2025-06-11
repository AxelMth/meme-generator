import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '../contexts/useAuthentication';
import { getUsersByIds } from '../api';
import { User } from '../types/user';

export const useUsersByIds = (ids: string[]): UseUsersByIdsResponse => {
  const token = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', ids],
    queryFn: async () => {
      return await getUsersByIds(token, ids);
    },
    enabled: ids.length > 0,
  });
  return { users: data ?? [], isLoading, error };
};

type UseUsersByIdsResponse = {
  users: User[];
  isLoading: boolean;
  error: Error | null;
};
