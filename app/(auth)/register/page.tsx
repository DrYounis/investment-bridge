import { RegisterForm } from './RegisterForm'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const defaultType = params.type || ''

  return <RegisterForm defaultType={defaultType} />
}
