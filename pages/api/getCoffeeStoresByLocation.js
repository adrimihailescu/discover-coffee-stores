import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
	//consigure latLong and limit
	try {
		const { latLong, limit } = req.query;
		const response = await fetchCoffeeStores(latLong, 30);
		res.status(200);
		res.json(response);
	} catch (err) {
		console.log("There is an error", err);
		res.status(500);
		res.json({ message: "Oh no! something went wrong", err });
	}
};

export default getCoffeeStoresByLocation;
