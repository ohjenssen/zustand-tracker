import Spinner from "./Spinner";
import { useAuthStore } from "../store/store";

export default function Greeting(){
  const user = useAuthStore((state) => state.user);
  console.log(user);
  return (
    <div>
        <h2>Hello {user.name}!</h2>
    </div>
  )
}


