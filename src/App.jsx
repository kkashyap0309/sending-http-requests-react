import { useRef, useState, useCallback } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updatePlaces } from "./httpUtil.js";
import ErrorPage from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [errorOccurred, setErrorOccurred] = useState();

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updatePlaces([...userPlaces, selectedPlace]);
    } catch (err) {
      console.log("something went wrong while updating selected places");
      setUserPlaces(userPlaces);
      setErrorOccurred({
        msg: "something went wrong while updating selected places",
      });
      //.. throw error
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try {
      const selectedPlaceToRemove = userPlaces.filter(
        (place) => place.id !== selectedPlace.current.id
      );
      await updatePlaces(selectedPlaceToRemove);
    } catch (error) {
      console.log("something went wrong while deleting selected places");
      setUserPlaces(userPlaces);
      setErrorOccurred({
        msg: "something went wrong while deleting selected places",
      });
      //.. throw error
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  function closeErrorModal() {
    setErrorOccurred(null);
  }

  return (
    <>
      <Modal open={errorOccurred} onClose={closeErrorModal}>
        {errorOccurred && (
          <ErrorPage
            title="Error Occurred!!"
            message={errorOccurred.msg}
            onConfirm={closeErrorModal}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
