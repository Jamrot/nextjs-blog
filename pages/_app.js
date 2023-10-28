import '../styles/styles.css'
import Banner from '../components/Banner';
import { useRouter } from 'next/router';
 
export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    return (
        <div>
          {router.pathname !== '/' && <Banner />}
          <Component {...pageProps} />
        </div>
      );
}