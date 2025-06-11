import { Flex, Heading, Button, Icon, HStack, StackDivider } from '@chakra-ui/react';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { AuthenticationState } from '../contexts/authentication';
import { useAuthentication } from '../contexts/useAuthentication';
import { UserDropdown } from '../components/user-dropdown';
import { Plus } from '@phosphor-icons/react';

type RouterContext = {
  authState: AuthenticationState;
};

const AuthenticationRouteComponent: React.FC = () => {
  const { state } = useAuthentication();
  return (
    <Flex width="full" height="full" direction="column">
      {/* Header */}
      <Flex bgColor="cyan.600" p={2} justifyContent="space-between" boxShadow="md">
        {/* Title */}
        <Heading size="lg" color="white">
          Meme Generator
        </Heading>
        {state.isAuthenticated && (
          <HStack alignItems="center" divider={<StackDivider border="white" />}>
            <Button as={Link} size="sm" leftIcon={<Icon as={Plus} />} to="/create">
              Create a meme
            </Button>
            <UserDropdown />
          </HStack>
        )}
      </Flex>
      <Flex flexGrow={1} height={0}>
        <Outlet />
      </Flex>
    </Flex>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: AuthenticationRouteComponent,
});
