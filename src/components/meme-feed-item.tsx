import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  Input,
  VStack,
  Button,
  Link,
} from '@chakra-ui/react';
import { Chat } from '@phosphor-icons/react';
import { format } from 'timeago.js';
import { useMemo, useState } from 'react';

import { Loader } from './loader';
import { Comment } from './comment';
import { MemePicture } from './meme-picture';

import { useCreateMemeComment } from '../hooks/useCreateMemeComment';
import { useMemeComments } from '../hooks/useMemeComments';
import { useUsersByIds } from '../hooks/useUsersByIds';

import { GetUserByIdResponse } from '../api';
import { type Meme } from '../types/meme';
import { type User } from '../types/user';

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
    <VStack
      key={meme.id}
      p={4}
      width="full"
      align="stretch"
      border="1px solid"
      borderColor="gray.100"
      borderRadius={8}
      backgroundColor="white"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
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

      <Text fontWeight="bold" fontSize="medium" mb={2}>
        <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-description-${meme.id}`}>
          {meme.description}
        </Text>
      </Text>
      <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} dataTestId={`meme-picture-${meme.id}`} />

      <LinkBox as={Box} py={2} position="sticky" top={0} zIndex={1} bg="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay data-testid={`meme-comments-section-${meme.id}`} cursor="pointer">
              <Text data-testid={`meme-comments-count-${meme.id}`}>
                <Icon as={Chat} mr={2} />
                {commentsCount || meme.commentsCount} comments
              </Text>
            </LinkOverlay>
            <Link
              onClick={() => setOpenedCommentSection(openedCommentSection === meme.id ? null : meme.id)}
              cursor="pointer"
              color="blue.500"
              fontWeight="bold"
              fontSize="sm"
              position="absolute"
              right={0}
            >
              {openedCommentSection === meme.id ? 'Fermer les commentaires' : 'Voir les commentaires'}
            </Link>
          </Flex>
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
              <Button
                onClick={fetchNextComments}
                cursor="pointer"
                backgroundColor="transparent"
                color="gray.500"
                fontWeight="bold"
                fontSize="sm"
                _hover={{ backgroundColor: 'transparent', color: 'blue.500' }}
                isLoading={isLoadingComments}
                disabled={isLoadingComments}
              >
                Load 10 more comments
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
  meme: Meme;
  connectedUser: User | undefined;
  author: User | undefined;
};
