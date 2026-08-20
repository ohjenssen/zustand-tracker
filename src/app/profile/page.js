import Navbar from '../components/Navbar/Navbar';
import ProfileContainer from '../components/ProfileContainer';
import { getUser } from '../utils/getUser';

export default async function ProfilePage() {

  return (
    <main className="min-h-screen bg-[#003d2b] text-white relative pb-24">
      <ProfileContainer  />
      <Navbar />
    </main>
  );
}