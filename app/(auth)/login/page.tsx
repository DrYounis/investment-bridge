export const dynamic = 'force-dynamic'

import { LoginForm } from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams
  const redirectTo = params.redirect || '/dashboard/hub'

  return <LoginForm redirectTo={redirectTo} />
}
