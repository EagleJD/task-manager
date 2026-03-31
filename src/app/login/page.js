import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import KuromiStickers from '@/components/KuromiStickers';
import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'My Task Diary — 로그인',
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) redirect('/');
  }

  return (
    <div className="page-wrapper">
      <div className="diary-surface" aria-hidden="true">
        <KuromiStickers />
      </div>
      <LoginForm />
    </div>
  );
}
