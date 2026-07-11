import type { Metadata } from "next"
import "./globals.css"
import Provider from "./providers"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import TerminalConsole from "@/components/terminal-console"
import AdminPanel from "@/components/admin-panel"

export const metadata: Metadata = {
  title: "DANN | Danish Ata Mahendra",
  description: "Full-stack Developer & UI/UX Enthusiast",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Provider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <TerminalConsole />
          <AdminPanel />
        </Provider>
      </body>
    </html>
  )
}
