import "./globals.css"
import { Providers } from "./providers";
import { ThemeStyles, DEFAULT_THEME_ID } from "@/lib/theme-system";

const themeId = process.env.NEXT_PUBLIC_THEME_ID || DEFAULT_THEME_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme={themeId} suppressHydrationWarning>
      <head>
        <ThemeStyles />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
