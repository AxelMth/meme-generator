import React, { PropsWithChildren } from 'react';
import {
  ListenerFn,
  Outlet,
  RouteComponent,
  RouterEvents,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, RenderResult } from '@testing-library/react';

function createTestRouter(component: RouteComponent, currentUrl: string) {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: currentUrl.split('?')[0],
    component,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([componentRoute]),
    history: createMemoryHistory({ initialEntries: [currentUrl] }),
  });

  return router;
}

type RenderWithRouterParams = {
  component: React.FC;
  Wrapper?: React.ComponentType<PropsWithChildren>;
  onNavigate?: ListenerFn<RouterEvents['onBeforeNavigate']>;
  currentUrl?: string;
};

type RenderWithRouterResult = {
  router: ReturnType<typeof createTestRouter>;
  renderResult: RenderResult;
};

export function renderWithRouter({
  component,
  Wrapper = React.Fragment,
  onNavigate = () => {},
  currentUrl = '/',
}: RenderWithRouterParams): RenderWithRouterResult {
  const router = createTestRouter(component, currentUrl);
  router.subscribe('onBeforeNavigate', onNavigate);
  const renderResult = render(
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>
  );

  return {
    router,
    renderResult,
  };
}
