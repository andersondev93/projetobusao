import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
// Removi temporariamente: import "leaflet/dist/leaflet.css";
import LeafletLoader from "../components/LeafletLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de Ônibus",
  description: "Sistema de gerenciamento de linhas de ônibus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <LeafletLoader />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
