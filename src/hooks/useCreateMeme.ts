import { useMutation } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { CreateCommentResponse, createMemeComment } from '../api';

type UseCreateMemeResponse = {
  createComment: (data: { memeId: string; content: string }) => void;
  createdComment: CreateCommentResponse | undefined;
};

export const useCreateMeme = (): UseCreateMemeResponse => {
  const token = useAuthToken();
  const { mutate, data } = useMutation({
    mutationFn: async ({ memeId, content }: { memeId: string; content: string }) => {
      return createMemeComment(token, memeId, content);
    },
  });

  return {
    createComment: mutate,
    createdComment: data,
  };
};
