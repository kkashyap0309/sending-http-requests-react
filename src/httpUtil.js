export async function getAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();
  if (!response.ok) {
    throw new Error();
  }

  return resData.places;
}
