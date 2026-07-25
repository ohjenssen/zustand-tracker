export async function getSpecificFood(id) {
  const res = await fetch(`http://localhost:3000/api/foods/${id}`, {
    cache: 'no-store' 
  });
  
  if (!res.ok) return null;
  return res.json();
}

