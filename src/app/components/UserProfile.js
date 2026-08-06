import { UserCircle, Edit2 } from 'lucide-react';
import { useUserStore } from '../store/store';
import Spinner from './Spinner';
import { useAuthStore } from '../store/store';
import { useRouter } from 'next/navigation';


export default function UserProfile({ onEdit = false }) {
    const router = useRouter();
    const name = useUserStore((state) => state.name);
    const email = useUserStore((state) => state.email);
    const age = useUserStore((state) => state.age);
    const dailyCalories = useUserStore((state) => state.dailyCalories);
    const logout = useAuthStore((state) => state.logout);
    const isLoading = useAuthStore((state) => state.isLoading);

    function handleLogout(){
        logout()
        setTimeout(() => {
            router.push('/')
        }, 1000)
    }

    return (
        <>
            { isLoading ? <Spinner /> : 
            <div className="flex flex-col items-center pt-12 p-6">
                {/* Edit Icon top right */}
                <button onClick={onEdit} className="absolute top-8 right-8 text-[#00ffb3] hover:scale-110 transition-transform">
                    <Edit2 size={24} />
                </button>

                {/* Profile Header */}
                <div className="flex items-center gap-6 self-start mb-20 mt-10">
                    <UserCircle size={100} strokeWidth={1} className="text-white" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-[#00ffb3]">{name}</h1>
                        <p className="text-sm text-[#00ffb3] opacity-80">{email}</p>
                        <p className="text-sm text-[#00ffb3] opacity-80 mt-2">{age} years old</p>
                    </div>
                </div>

                {/* Main Stats Area */}
                <div className="flex-1 flex flex-col items-center justify-center text-center mt-20">
                    <h2 className="text-2xl font-medium text-[#00ffb3] mb-4">Daily calories</h2>
                    <p className="text-6xl font-bold text-[#00ffb3]">{dailyCalories}</p>
                </div>

                <button onClick={handleLogout}>Log out</button>
            </div>
            }
        </>
    );
}