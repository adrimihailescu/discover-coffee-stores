import { useRouter } from "next/dist/client/router";
import Link from "next/dist/client/link";

import coffeeStoresData from '../../data/coffee-stores.json';
import Head from "next/head";
import styles from '../../styles/coffee-store.module.css';
import Image from "next/image";
import cls from "classnames";

export function getStaticProps(staticProps) {
    const params = staticProps.params;
    console.log('params', params);
    return {
        props: {coffeeStore: coffeeStoresData.find(coffeeStore => {
            return coffeeStore.id.toString() === params.id; //dynamic id
            }),
        },
    };
}

export function getStaticPaths() {
    const paths = coffeeStoresData.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            }
        }
    })
    return {
        paths,
        fallback: true,
    };
}

const CoffeeStore = (props) => {
    const router = useRouter();
        
    if(router.isFallback) {
        return <div>Loading...</div>
    }
    const {address, name, neighbourhood, imgUrl} = props.coffeeStore;

    const handleUpvoteButton = () => {
        console.log('handle upvote!');
    }

    return (
        <div className={styles.layout}>
          <Head>
            <title>{name}</title>
          </Head>
        <div className={styles.container}>
            <div className={styles.col1}>
                <div className={styles.backToHomeLink}>
                <Link href="/">
                <a>Back to home</a>
                </Link> 
                </div>
                <div className={styles.nameWrapper}>
                    <h1 className={name}>{name}</h1>
                </div>
                <Image 
                    src={imgUrl} 
                    width={600} 
                    height={360} 
                    className={styles.storeImg} 
                    alt={name} />
                    </div>
                    <div className={cls("glass",styles.col2)}>
                    <div className={styles.iconWrapper}>
                      <Image src="/static/icons/places.svg" width="24" height="24" alt="image"/>
                      <p className={styles.text}>{address}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                      <Image src="/static/icons/nearMe.svg" width="24" height="24" alt="image"/>
                      <p className={styles.text}>{neighbourhood}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                      <Image src="/static/icons/star.svg" width="24" height="24" alt="image"/>
                      <p className={styles.text}>1</p>
                    </div>

                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up Vote!</button>
                </div>
            </div>
        </div>
    )
};
export default CoffeeStore;







