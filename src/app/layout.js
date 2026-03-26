import './globals.css';

export const metadata = {
  title: 'My Task Diary',
  description: '쿠로미 스티커와 다이어리 감성으로 꾸민 태스크 매니저',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
