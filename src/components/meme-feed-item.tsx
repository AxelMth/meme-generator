import { Avatar, Box, Collapse, Flex, Icon, LinkBox, LinkOverlay, Text, Input, VStack, Button } from '@chakra-ui/react';
import { CaretDown, CaretUp, Chat } from '@phosphor-icons/react';
import { format } from 'timeago.js';

import { Loader } from './loader';
import { Comment } from './comment';
import { MemePicture } from './meme-picture';
import { GetMemeCommentsResponse, GetMemesResponse, GetUserByIdResponse } from '../api';

export const MemeFeedItem = ({
  meme,
  openedCommentSection,
  setOpenedCommentSection,
  isLoadingComments,
  comments,
  hasNextComments,
  fetchNextComments,
  commentContent,
  setCommentContent,
  user,
  createComment,
}: MemeFeedItemProps) => {
  return (
    <VStack key={meme.id} p={4} width="full" align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          {/* <Avatar
                    borderWidth="1px"
                    borderColor="gray.300"
                    size="xs"
                    name={meme.author.username}
                    src={meme.author.pictureUrl}
                  />
                  <Text ml={2} data-testid={`meme-author-${meme.id}`}>{meme.author.username}</Text> */}
        </Flex>
        <Text fontStyle="italic" color="gray.500" fontSize="small">
          {format(meme.createdAt)}
        </Text>
      </Flex>
      <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} dataTestId={`meme-picture-${meme.id}`} />
      <Box>
        <Text fontWeight="bold" fontSize="medium" mb={2}>
          Description:{' '}
        </Text>
        <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
          <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-description-${meme.id}`}>
            {meme.description}
          </Text>
        </Box>
      </Box>
      <LinkBox as={Box} py={2} borderBottom="1px solid black">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay
              data-testid={`meme-comments-section-${meme.id}`}
              cursor="pointer"
              onClick={() => setOpenedCommentSection(openedCommentSection === meme.id ? null : meme.id)}
            >
              <Text data-testid={`meme-comments-count-${meme.id}`}>{meme.commentsCount} comments</Text>
            </LinkOverlay>
            <Icon as={openedCommentSection !== meme.id ? CaretDown : CaretUp} ml={2} mt={1} />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={openedCommentSection === meme.id} animateOpacity>
        <VStack align="stretch" spacing={4}>
          {isLoadingComments && <Loader data-testid="meme-comments-loader" />}
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} memeId={meme.id} />
          ))}
          {hasNextComments && !isLoadingComments && (
            <Box py={4} width="full" textAlign="center">
              <Button onClick={fetchNextComments}>Load more comments</Button>
            </Box>
          )}
        </VStack>
        <Box mt={6}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (commentContent[meme.id]) {
                createComment({
                  memeId: meme.id,
                  content: commentContent[meme.id],
                });
              }
            }}
          >
            <Flex alignItems="center">
              <Avatar
                borderWidth="1px"
                borderColor="gray.300"
                name={user?.username}
                src={user?.pictureUrl}
                size="sm"
                mr={2}
              />
              <Input
                placeholder="Type your comment here..."
                onChange={(event) => {
                  setCommentContent({
                    ...commentContent,
                    [meme.id]: event.target.value,
                  });
                }}
                value={commentContent[meme.id]}
              />
            </Flex>
          </form>
        </Box>
      </Collapse>
    </VStack>
  );
};

type MemeFeedItemProps = {
  // Create type
  meme: GetMemesResponse['results'][0];
  openedCommentSection: string | null;
  setOpenedCommentSection: (id: string | null) => void;
  isLoadingComments: boolean;
  // Create type
  comments: GetMemeCommentsResponse['results'];
  hasNextComments: boolean;
  fetchNextComments: () => void;
  commentContent: {
    [key: string]: string;
  };
  setCommentContent: (content: { [key: string]: string }) => void;
  user: GetUserByIdResponse | undefined;
  createComment: (data: { memeId: string; content: string }) => void;
};
