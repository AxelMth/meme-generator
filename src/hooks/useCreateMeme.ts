import { useMutation } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { createMeme, CreateMemePayload, CreateMemeResponse } from '../api';
import { Meme } from '../types/meme';
import { useLogoutOnUnauthorized } from './useLogoutOnUnauthorized';

type UseCreateMemeResponse = { createMeme: (data: CreateMemePayload) => void; createdMeme: Meme | undefined };

export const useCreateMeme = (): UseCreateMemeResponse => {
  const token = useAuthToken();
  const { mutate, data, error } = useMutation({
    mutationFn: async (meme: CreateMemePayload) => {
      return createMeme(token, meme);
    },
  });

  useLogoutOnUnauthorized(error);

  return { createMeme: mutate, createdMeme: data ? mapMeme(data) : undefined };
};

function mapMeme(meme: CreateMemeResponse): Meme {
  return { ...meme, texts: [], commentsCount: 0, createdAt: meme.createdAt, authorId: meme.authorId };
}
