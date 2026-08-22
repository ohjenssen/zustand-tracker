import Navbar from '@/app/components/Navbar/Navbar';
import ProfileContainer from './ProfileContainer/ProfileContainer';

export default async function ProfilePage() {

  return (
    <main>
      <ProfileContainer  />
      <Navbar />
    </main>
  );
}