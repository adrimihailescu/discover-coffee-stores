import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/dist/client/router";
import Link from "next/dist/client/link";
import { StoreContext } from "../../store/store-context";

import coffeeStoresData from "../../data/coffee-stores.json";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { isEmpty, fetcher } from "../../utils";

import useSWR from "swr";

export async function getStaticProps(staticProps) {
	const params = staticProps.params;
	const coffeeStores = await fetchCoffeeStores();
	const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
		return coffeeStore.id.toString() === params.id;
	});

	return {
		props: {
			coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
		},
	};
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores();

	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: {
				id: coffeeStore.id.toString(),
			},
		};
	});
	return {
		paths,
		fallback: true,
	};
}

const CoffeeStore = (initialProps) => {
	const router = useRouter();

	const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

	const {
		state: { coffeeStores },
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useContext(StoreContext);

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	const id = router.query.id;

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, address, neighborhood, imgUrl, voting } = coffeeStore;
			const response = await fetch("/api/createCoffeeStore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name,
					address: address || "",
					neighborhood: neighborhood || "",
					imgUrl,
					voting: 0,
				}),
			});

			const dbCoffeeStore = response.json();
		} catch (err) {
			console.error("Error creating coffee store", err);
		}
	};

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id;
				});
				if (coffeeStoreFromContext) {
					setCoffeeStore(coffeeStoreFromContext);
					handleCreateCoffeeStore(coffeeStoreFromContext);
				}
			}
		} else {
			handleCreateCoffeeStore(initialProps.coffeeStore);
		}
	}, [coffeeStores, id, initialProps.coffeeStore]);

	const { name, address, neighborhood, imgUrl } = coffeeStore;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [votingCount, setVotingCount] = useState(0);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (data && data.length > 0) {
			setCoffeeStore(data[0]);

			setVotingCount(data[0].voting);
		}
	}, [data]);

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch("/api/favouriteCoffeeStoreById", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});

			const dbCoffeeStore = await response.json();

			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1;
				setVotingCount(count);
			}
		} catch (err) {
			console.error("Error upvoting coffee store", err);
		}
	};

	if (error) {
		return <div>Something went wrong retrieving coffee store page</div>;
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
							<a>??? Back to home</a>
						</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={name}>{name}</h1>
					</div>
					<Image
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
						}
						width={600}
						height={360}
						className={styles.storeImg}
						alt={name}
					/>
				</div>
				<div className={cls("glass", styles.col2)}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/places.svg"
								width="24"
								height="24"
								alt="image"
							/>
							<p className={styles.text}>{address}</p>
						</div>
					)}

					{neighborhood && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/nearMe.svg"
								width="24"
								height="24"
								alt="image"
							/>
							<p className={styles.text}>{neighborhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/star.svg"
							width="24"
							height="24"
							alt="image"
						/>
						<p className={styles.text}>{votingCount}</p>
					</div>

					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>
						Up Vote!
					</button>
				</div>
			</div>
		</div>
	);
};
export default CoffeeStore;
