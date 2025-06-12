import { useNavigate } from '@tanstack/react-router';
import { UnauthorizedError } from '../api';

export const useLogoutOnUnauthorized = (error: Error | null) => {
  const navigate = useNavigate();
  if (error instanceof UnauthorizedError) {
    navigate({ to: '/login' });
  }
};
