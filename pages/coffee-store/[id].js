import { useRouter } from "next/dist/client/router";
import Link from "next/dist/client/link";

const CoffeeStore = () => {
    const router = useRouter();
    console.log('router', router);
    return (
    <div>Coffee Store Page {router.query.id}
        <Link href="/"><a>Back to home</a></Link>
    </div>)
};

export default CoffeeStore;
