import BackButton from '@/app/components/BackButton/BackButton';
import DetailsClientForm from './DetailsClientForm/DetailsClientForm';
import styles from './page.module.css';

export default async function DetailsPage({ params }) {
  const { id } = await params; 

  return (
    <main className={styles.main}>
      <DetailsClientForm id={id}/>
      <BackButton />
    </main>
  );
}