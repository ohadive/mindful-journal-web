import { GetServerSideProps } from 'next'
import { MainLayout } from '../components/layout/main-layout'
import EntryLayout from '../components/EntryManagement/EntryLayout'
import { requireAuth, AuthenticatedPageProps } from '../lib/auth-utils'

export default function Dashboard({ session }: AuthenticatedPageProps) {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)]">
        <EntryLayout className="h-full" />
      </div>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = requireAuth()