'use client'
import { useEffect } from "react";
import { useUserStore } from "../store/store"
import Spinner from "./Spinner";

export default function Greeting(){
  const fetchUser = useUserStore((state) => state.fetchUser);
  const loading = useUserStore((state) => state.loading);

  useEffect(() => {
    fetchUser();
  }, [fetchUser])

  const name = useUserStore((state) => state.name);

  return (
    <div>
      { loading ? <Spinner size='sm'/> :
        <h2>Hello {name}!</h2>
      }
    </div>
  )
}


