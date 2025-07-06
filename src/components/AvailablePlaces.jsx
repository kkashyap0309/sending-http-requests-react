import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { getAvailablePlaces } from "../httpUtil.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [err, setErr] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      // we can add a function inside the useEffect hook to wait for the result synchronously
      setDataLoading(true);
      try {
        const places = await getAvailablePlaces();
        //getting user location to sort the places by distance by using javascript navigator method
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setDataLoading(false);
        });
      } catch (error) {
        setErr({
          msg: error.message || "Could not fetch the details try again !!!",
        });
        setDataLoading(false);
      }
    }

    fetchPlaces(); //then call the above function
  }, []);

  if (err) {
    return <ErrorPage title="Something went wrong" message={err.msg} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      dataLoading={dataLoading}
      dataLoadingMsg="Fetching places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
