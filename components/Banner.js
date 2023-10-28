// components/Banner.js
import Link from 'next/link';

function Banner() {
    return (
        <div className="banner">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
        </div>
    );
}

export default Banner;