import { useMutation } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { CreateCommentResponse, createMemeComment } from '../api';

type UseCreateMemeCommentProps = {
  memeId: string;
};

type UseCreateMemeCommentResponse = {
  createComment: (data: { content: string }) => void;
  createdComment: CreateCommentResponse | undefined;
};

export const useCreateMemeComment = ({ memeId }: UseCreateMemeCommentProps): UseCreateMemeCommentResponse => {
  const token = useAuthToken();
  const { mutate, data } = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      return createMemeComment(token, memeId, content);
    },
  });

  return {
    createComment: mutate,
    createdComment: data,
  };
};
