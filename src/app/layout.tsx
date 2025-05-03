import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeProviderWrapper from './theme-provider';

export const metadata: Metadata = {
  title: 'Minecraft 服务器公告与反馈系统',
  description: '查看服务器公告并提交反馈',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <AppRouterCacheProvider>
          <ThemeProviderWrapper>
            {children}
          </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}