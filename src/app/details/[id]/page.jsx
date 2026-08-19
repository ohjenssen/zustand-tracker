import DetailsClientForm from './DetailsClientForm/DetailsClientForm';

export default async function DetailsPage({ params }) {
  const { id } = await params; 

  return (
    <main className="min-h-screen bg-[#003d2b] text-white p-6 pb-32 flex flex-col font-sans">

      <DetailsClientForm id={id}/>
    
    </main>
  );
}