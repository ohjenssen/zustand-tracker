export async function getUser() {
  const res = await fetch(`http://localhost:3000/api/user`, {
    cache: 'no-store' 
  });
  
  if (!res.ok) return null;
  return res.json();
}

