export async function getAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();
  if (!response.ok) {
    throw new Error();
  }

  return resData.places;
}

export async function getUserSelectedPlaces() {
  const response = await fetch("http://localhost:3000/user-places");
  const resData = await response.json();
  if (!response.ok) {
    throw new Error();
  }

  return resData.places;
}

export async function updatePlaces(places) {
  const updateResponse = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    body: JSON.stringify({ places }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!updateResponse.ok) {
    throw new Error();
  }

  const resData = await updateResponse.json();
  return resData.message;
}
