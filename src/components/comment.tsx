import { Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'timeago.js';

import { Avatar } from '@chakra-ui/react';

import { GetMemeCommentsResponse, GetUserByIdResponse } from '../api';

type CommentProps = {
  comment: GetMemeCommentsResponse['results'][0];
  author: GetUserByIdResponse | undefined;
  memeId: string;
};
export const Comment = ({ comment, author, memeId }: CommentProps) => {
  const authorName = author?.username || 'Unknown';
  const authorPictureUrl = author?.pictureUrl || '';
  return (
    <Flex key={comment.id}>
      <Avatar borderWidth="1px" borderColor="gray.300" size="sm" name={authorName} src={authorPictureUrl} mr={2} />
      <Box p={2} borderRadius={8} bg="gray.50" border="1px solid" borderColor="gray.100" flexGrow={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            <Text
              data-testid={`meme-comment-author-${memeId}-${comment.id}`}
              fontWeight="bold"
              fontSize="sm"
              color="gray.500"
            >
              {authorName}
            </Text>
          </Flex>
          <Text fontStyle="italic" color="gray.500" fontSize="small">
            {format(comment.createdAt)}
          </Text>
        </Flex>
        <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-comment-content-${memeId}-${comment.id}`}>
          {comment.content}
        </Text>
      </Box>
    </Flex>
  );
};
