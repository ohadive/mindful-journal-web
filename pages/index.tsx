import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'

// Redirect to dashboard with entry management
export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  }
}