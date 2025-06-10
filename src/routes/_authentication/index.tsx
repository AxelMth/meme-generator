import { createFileRoute } from '@tanstack/react-router';
import { Box, Flex, StackDivider, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Loader } from '../../components/loader';
import { MemeFeedItem } from '../../components/meme-feed-item';
import { useMemes } from '../../hooks/useMemes';
import { useUser } from '../../hooks/useUser';
import { useUsersByIds } from '../../hooks/useUsersByIds';

import { GetUserByIdResponse } from '../../api';

export const MemeFeedPage: React.FC = () => {
  const { isLoading, memes, fetchNextPage, hasNextPage } = useMemes();
  const { user } = useUser();

  const { users } = useUsersByIds(memes?.map((meme) => meme.authorId) || []);
  const usersByAuthorId = useMemo(() => {
    if (!users || users.length === 0) {
      return {};
    }
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<string, GetUserByIdResponse>
    );
  }, [users]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50 && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }

  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto" onScroll={handleScroll}>
      <VStack p={4} width="full" maxWidth={800} divider={<StackDivider border="gray.200" />}>
        {memes?.map((meme) => (
          <MemeFeedItem key={meme.id} meme={meme} connectedUser={user} author={usersByAuthorId?.[meme.authorId]} />
        ))}
        {hasNextPage && (
          <Box py={4} width="full" textAlign="center">
            <Loader data-testid="meme-feed-loader-next-page" />
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute('/_authentication/')({
  component: MemeFeedPage,
});
