import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});


const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

export const fetchCoffeeStores = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 30,
  });
  const unsplashResults = photos.response?.results;
  console.log({unsplashResults});

    const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: process.env.FOURSQUARE_API_KEY,
        }
      };
      
      const response = await fetch(getUrlForCoffeeStores("51.42749857436933%2C-0.16744358602580267", "coffee", 6), options);
        const data = await response.json();
        return data.results;
      console.log(data.results);
        // .catch(err => console.error(err));
};