import { useQuery } from "@tanstack/react-query";
import { useAuthToken } from "../contexts/useAuthentication";
import { GetMemeCommentsResponse, getMemeComments, getMemes, GetMemesResponse, getUserById, GetUserByIdResponse } from "../api";

export const useMemes = (): { memes: (GetMemesResponse["results"][0] & {
  author: GetUserByIdResponse;
  comments: (GetMemeCommentsResponse["results"][0] & {
    author: GetUserByIdResponse;
  })[];
})[] | undefined, isLoading: boolean, error: Error | null } => {
  const token = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ["memes"],
    queryFn: async () => {
      const memes: GetMemesResponse["results"] = [];
      const firstPage = await getMemes(token, 1);
      memes.push(...firstPage.results);
      const remainingPages =
        Math.ceil(firstPage.total / firstPage.pageSize) - 1;
      for (let i = 0; i < remainingPages; i++) {
        const page = await getMemes(token, i + 2);
        memes.push(...page.results);
      }
      const memesWithAuthorAndComments = [];
      for (const meme of memes) {
        const author = await getUserById(token, meme.authorId);
        const comments: GetMemeCommentsResponse["results"] = [];
        const firstPage = await getMemeComments(token, meme.id, 1);
        comments.push(...firstPage.results);
        const remainingCommentPages =
          Math.ceil(firstPage.total / firstPage.pageSize) - 1;
        for (let i = 0; i < remainingCommentPages; i++) {
          const page = await getMemeComments(token, meme.id, i + 2);
          comments.push(...page.results);
        }
        const commentsWithAuthor: (GetMemeCommentsResponse["results"][0] & {
          author: GetUserByIdResponse;
        })[] = [];
        for (const comment of comments) {
          const author = await getUserById(token, comment.authorId);
          commentsWithAuthor.push({ ...comment, author });
        }
        memesWithAuthorAndComments.push({
          ...meme,
          author,
          comments: commentsWithAuthor,
        });
      }
      return memesWithAuthorAndComments;
    },
  });
  return { memes: data, isLoading, error };
};