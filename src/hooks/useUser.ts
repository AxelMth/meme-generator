import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

import { getUserById, GetUserByIdResponse } from '../api';
import { useAuthToken } from '../contexts/useAuthentication';

export const useUser = (): { user: GetUserByIdResponse | undefined; isLoading: boolean; error: Error | null } => {
  const token = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return await getUserById(token, jwtDecode<{ id: string }>(token).id);
    },
  });
  return { user: data, isLoading, error };
};
