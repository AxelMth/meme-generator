export type Meme = {
  id: string;
  description: string;
  pictureUrl: string;
  texts: {
    content: string;
    x: number;
    y: number;
  }[];
  commentsCount: number;
  createdAt: string;
  authorId: string;
};
