import { useMutation } from '@tanstack/react-query';

import { useAuthToken } from '../contexts/useAuthentication';
import { createMeme, CreateMemePayload, CreateMemeResponse } from '../api';

type UseCreateMemeResponse = {
  createMeme: (data: CreateMemePayload) => void;
  createdMeme: CreateMemeResponse | undefined;
};

export const useCreateMeme = (): UseCreateMemeResponse => {
  const token = useAuthToken();
  const { mutate, data } = useMutation({
    mutationFn: async (meme: CreateMemePayload) => {
      return createMeme(token, meme);
    },
  });

  return {
    createMeme: mutate,
    createdMeme: data,
  };
};
