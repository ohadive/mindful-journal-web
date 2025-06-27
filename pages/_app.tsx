import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Inter, Crimson_Text, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '../lib/providers/theme-provider'
import '../src/app/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <div className={`${inter.variable} ${crimsonText.variable} ${jetbrainsMono.variable}`}>
      <SessionProvider session={session}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="journal-ui-theme"
        >
          <div className="min-h-screen bg-background font-sans antialiased">
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </SessionProvider>
    </div>
  )
}