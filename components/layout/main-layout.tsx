import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import KeyboardShortcutsProvider from '../KeyboardShortcuts/KeyboardShortcutsProvider'
import { ToastProvider } from '../ui/Toast'
import { ConfirmDialogProvider } from '../ui/ConfirmDialog'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        <KeyboardShortcutsProvider>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:pl-72">
              <Header />
              <main className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </KeyboardShortcutsProvider>
      </ConfirmDialogProvider>
    </ToastProvider>
  )
}