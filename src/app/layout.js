import './globals.css';

export const metadata = {
  title: 'My Task Diary',
  description: '쿠로미 스티커와 다이어리 감성으로 꾸민 태스크 매니저',
  openGraph: {
    title: 'My Task Diary',
    description: '쿠로미 스티커와 다이어리 감성으로 꾸민 태스크 매니저',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 675 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Task Diary',
    description: '쿠로미 스티커와 다이어리 감성으로 꾸민 태스크 매니저',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
