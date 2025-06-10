import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authentication/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authentication/"!</div>
}
