import { useMutation } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { createMemeComment } from '../api';

type UseCreateMemeResponse = {
  createComment: (data: { memeId: string; content: string }) => void;
};

export const useCreateMeme = (): UseCreateMemeResponse => {
  const token = useAuthToken();
  const { mutate } = useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      await createMemeComment(token, data.memeId, data.content);
    },
  });

  return {
    createComment: mutate,
  };
};
