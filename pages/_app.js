import '../styles/styles.css'
import '../styles/layoutstyles.css'
import Banner from '../components/Banner';
import { useRouter } from 'next/router';
 
export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    return (
        <div>
          {/* {router.pathname !== '/' && <Banner />} */}
          <Banner />
          <Component {...pageProps} />
        </div>
      );
}