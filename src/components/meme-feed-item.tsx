import { Avatar, Box, Collapse, Flex, Icon, LinkBox, LinkOverlay, Text, Input, VStack, Button } from '@chakra-ui/react';
import { CaretDown, CaretUp, Chat } from '@phosphor-icons/react';
import { format } from 'timeago.js';
import { useMemo, useState } from 'react';

import { Loader } from './loader';
import { Comment } from './comment';
import { MemePicture } from './meme-picture';

import { useCreateMemeComment } from '../hooks/useCreateMemeComment';
import { useMemeComments } from '../hooks/useMemeComments';
import { useUsersByIds } from '../hooks/useUsersByIds';

import { GetMemesResponse, GetUserByIdResponse } from '../api';

export const MemeFeedItem = ({ meme, connectedUser, author }: MemeFeedItemProps) => {
  const [openedCommentSection, setOpenedCommentSection] = useState<string | null>(null);
  const {
    comments,
    commentsCount,
    isLoading: isLoadingComments,
    fetchNextComments,
    hasNextComments,
    addComment,
  } = useMemeComments(openedCommentSection);

  const authorIds = useMemo(() => {
    return [...new Set(comments.map((comment) => comment.authorId))];
  }, [comments]);

  const sortedComments = useMemo(() => {
    return comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [comments]);

  const { users: authors } = useUsersByIds(authorIds);

  const authorById = useMemo(() => {
    if (!authors) {
      return {};
    }
    return authors.reduce(
      (acc, author) => {
        acc[author.id] = author;
        return acc;
      },
      {} as Record<string, GetUserByIdResponse>
    );
  }, [authors]);

  const [commentContent, setCommentContent] = useState('');
  const { createComment, createdComment } = useCreateMemeComment({ memeId: meme.id });

  if (createdComment && !comments.find((comment) => comment.id === createdComment?.id)) {
    addComment(createdComment);
    setCommentContent('');
  }

  const handleCreateComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!commentContent) {
      return;
    }
    createComment({
      content: commentContent,
    });
  };

  return (
    <VStack key={meme.id} p={4} width="full" align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Avatar borderWidth="1px" borderColor="gray.300" size="xs" name={author?.username} src={author?.pictureUrl} />
          <Text ml={2} data-testid={`meme-author-${meme.id}`}>
            {author?.username}
          </Text>
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
      <LinkBox as={Box} py={2} borderBottom="1px solid black" position="sticky" top={0} zIndex={1} bg="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay
              data-testid={`meme-comments-section-${meme.id}`}
              cursor="pointer"
              onClick={() => setOpenedCommentSection(openedCommentSection === meme.id ? null : meme.id)}
            >
              <Text data-testid={`meme-comments-count-${meme.id}`}>{commentsCount || meme.commentsCount} comments</Text>
            </LinkOverlay>
            <Icon as={openedCommentSection !== meme.id ? CaretDown : CaretUp} ml={2} mt={1} />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={openedCommentSection === meme.id} animateOpacity>
        <VStack align="stretch" spacing={4}>
          {isLoadingComments && <Loader data-testid="meme-comments-loader" />}
          {sortedComments.map((comment) => (
            <Comment key={comment.id} comment={comment} author={authorById[comment.authorId]} memeId={meme.id} />
          ))}
          {hasNextComments && (
            <Box py={4} width="full" textAlign="center">
              <Button onClick={fetchNextComments} isLoading={isLoadingComments}>
                Load more comments
              </Button>
            </Box>
          )}
        </VStack>
        <Box mt={6}>
          <form onSubmit={handleCreateComment}>
            <Flex alignItems="center">
              <Avatar
                borderWidth="1px"
                borderColor="gray.300"
                name={connectedUser?.username}
                src={connectedUser?.pictureUrl}
                size="sm"
                mr={2}
              />
              <Input
                data-testid={`meme-comment-input-meme_id_${meme.id}`}
                placeholder="Type your comment here..."
                onChange={(event) => {
                  setCommentContent(event.target.value);
                }}
                value={commentContent}
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
  // Create type
  connectedUser: GetUserByIdResponse | undefined;
  author: GetUserByIdResponse | undefined;
};
