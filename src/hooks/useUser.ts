import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

import { getUserById } from '../api';
import { useAuthToken } from '../contexts/useAuthentication';
import { User } from '../types/user';
import { useLogoutOnUnauthorized } from './useLogoutOnUnauthorized';

export const useUser = (): UseUserResponse => {
  const token = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return await getUserById(token, jwtDecode<{ id: string }>(token).id);
    },
  });
  useLogoutOnUnauthorized(error);
  return { user: data, isLoading, error };
};

type UseUserResponse = { user: User | undefined; isLoading: boolean; error: Error | null };
