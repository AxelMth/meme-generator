import { useMutation } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { createMemeComment } from '../api';
import { Comment } from '../types/comment';

type UseCreateMemeCommentProps = {
  memeId: string;
};

type UseCreateMemeCommentResponse = {
  createComment: (data: { content: string }) => void;
  createdComment: Comment | undefined;
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
