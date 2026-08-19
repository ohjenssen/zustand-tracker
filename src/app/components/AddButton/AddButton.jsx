import styles from './addButton.module.css';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function AddButton({href}){
    return (
        <div className={styles.fabWrapper}>
            <Link 
                href={href} 
                className={styles.fabButton}
            >
                <Plus size={32} strokeWidth={3} />
            </Link>
        </div>
    )
}