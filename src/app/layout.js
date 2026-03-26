import "./globals.css";

export const metadata = {
  title: "✨ My Task Diary 🌸",
  description: "かわいいタスク管理アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
