import { createApi } from "unsplash-js";

const unsplashApi = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhoto = async () => {
	const photos = await unsplashApi.search.getPhotos({
		query: "coffee shop",
		page: 1,
		perPage: 40,
	});
	const unsplashResults = photos.response.results;

	return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
	latLong = "51.42749857436933%2C-0.16744358602580267",
	limit = 6
) => {
	const photos = await getListOfCoffeeStorePhoto();

	const options = {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
		},
	};

	const response = await fetch(
		getUrlForCoffeeStores(latLong, "coffee shop", limit),
		options
	);

	const data = await response.json();

	return (
		data &&
		data.results.map((result, idx) => {
			const neighborhood = result.location.neighborhood;

			return {
				id: result.fsq_id,
				address: result.location.address,
				name: result.name,
				neighborhood: neighborhood?.length > 0 ? neighborhood[0] : "",
				imgUrl: photos.length > 0 ? photos[idx] : null,
			};
		})
	);
};
// .catch(err => console.error(err));
