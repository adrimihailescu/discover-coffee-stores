import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});


const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

const getListOfCoffeeStorePhoto = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 10,
  });
 const unsplashResults = photos.response.results;
 
 return unsplashResults.map(
  (result) => result.urls["small"]);
}
export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhoto();
      const options = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY,
          }
        };
        
  const response = await fetch(getUrlForCoffeeStores("51.42749857436933%2C-0.16744358602580267", "coffee", 6), options);
    const data = await response.json();
    return data.results.map((result, idx) => {
      const neighborhood = result.location.neighborhood;
      return {
      id: result.fsq_id,
      address: result.location.address,
      name: result.name,
      neighborhood:neighborhood?.length > 0 ? neighborhood[0] : "",
      imgUrl: photos.length > 0 ?photos[idx] : null,
      }
    });
  };
  // .catch(err => console.error(err));
            
  