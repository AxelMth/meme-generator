import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { AuthenticationContext } from '../../../contexts/authentication';
import { MemeFeedPage } from '../../../routes/_authentication/index';
import { renderWithRouter } from '../../utils';

describe('routes/_authentication/index', () => {
  describe('MemeFeedPage', () => {
    function renderMemeFeedPage() {
      return renderWithRouter({
        component: MemeFeedPage,
        Wrapper: ({ children }) => (
          <ChakraProvider>
            <QueryClientProvider client={new QueryClient()}>
              <AuthenticationContext.Provider
                value={{
                  state: {
                    isAuthenticated: true,
                    userId: 'dummy_user_id',
                    token: 'dummy_token',
                  },
                  authenticate: () => {},
                  signout: () => {},
                }}
              >
                {children}
              </AuthenticationContext.Provider>
            </QueryClientProvider>
          </ChakraProvider>
        ),
      });
    }

    it('should fetch the memes and display them with their comments', async () => {
      renderMemeFeedPage();

      const memeId = 'dummy_meme_id_1';
      const commentId1 = 'dummy_comment_id_1';
      const commentId2 = 'dummy_comment_id_2';
      const commentId3 = 'dummy_comment_id_3';

      await waitFor(() => {
        // We check that the right author's username is displayed
        expect(screen.getByTestId(`meme-author-${memeId}`)).toHaveTextContent('dummy_user_1');

        // We check that the right meme's picture is displayed
        expect(screen.getByTestId(`meme-picture-${memeId}`)).toHaveStyle({
          'background-image': 'url("https://dummy.url/meme/1")',
        });

        // We check that the right texts are displayed at the right positions
        const text1 = screen.getByTestId(`meme-picture-${memeId}-text-0`);
        const text2 = screen.getByTestId(`meme-picture-${memeId}-text-1`);
        expect(text1).toHaveTextContent('dummy text 1');
        expect(text1).toHaveStyle({
          top: '0px',
          left: '0px',
        });
        expect(text2).toHaveTextContent('dummy text 2');
        expect(text2).toHaveStyle({
          top: '100px',
          left: '100px',
        });

        // We check that the right description is displayed
        expect(screen.getByTestId(`meme-description-${memeId}`)).toHaveTextContent('dummy meme 1');

        // We check that the right number of comments is displayed
        expect(screen.getByTestId(`meme-comments-count-${memeId}`)).toHaveTextContent('3 comments');
      });

      act(() => {
        fireEvent.click(screen.getByTestId(`meme-comments-toggle-${memeId}`));
      });

      await waitFor(() => {
        expect(screen.getByTestId(`meme-comment-content-${memeId}-${commentId1}`)).toHaveTextContent('dummy comment 1');
        expect(screen.getByTestId(`meme-comment-author-${memeId}-${commentId1}`)).toHaveTextContent('dummy_user_1');

        expect(screen.getByTestId(`meme-comment-content-${memeId}-${commentId2}`)).toHaveTextContent('dummy comment 2');
        expect(screen.getByTestId(`meme-comment-author-${memeId}-${commentId2}`)).toHaveTextContent('dummy_user_2');

        expect(screen.getByTestId(`meme-comment-content-${memeId}-${commentId3}`)).toHaveTextContent('dummy comment 3');
        expect(screen.getByTestId(`meme-comment-author-${memeId}-${commentId3}`)).toHaveTextContent('dummy_user_3');
      });
    });

    it('should create a comment when the user submits the comment form', async () => {
      renderMemeFeedPage();

      const memeId = 'dummy_meme_id_1';
      const commentId = 'dummy_comment_id_4';

      const commentInput = await screen.findByTestId(`meme-comment-input-meme_id_${memeId}`);

      act(() => {
        fireEvent.change(commentInput, { target: { value: 'dummy comment 1' } });
        fireEvent.submit(commentInput);
        fireEvent.click(screen.getByTestId(`meme-comments-section-${memeId}`));
      });

      await waitFor(() => {
        expect(screen.getByTestId(`meme-comment-content-${memeId}-${commentId}`)).toHaveTextContent('dummy comment 1');
      });
    });
  });
});
