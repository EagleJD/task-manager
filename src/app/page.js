import KuromiStickers from '@/components/KuromiStickers';
import DiaryApp from '@/components/DiaryApp';

export const metadata = {
  title: 'My Task Diary',
  description: 'Kuromi sticker diary task manager',
};

export default function Home() {
  return (
    <div className="page-wrapper">
      <div className="diary-surface" aria-hidden="true">
        <KuromiStickers />
      </div>

      <DiaryApp />
    </div>
  );
}
