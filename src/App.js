import React,{useState} from "react";
import HotspotImage from "./components/Hotspots";

const App = () => {
  const [hotSpotModal, setHotSpotModal] = useState(false)

  return (
    <>
      <div className="w-full h-screen bg-neutral-700 flex justify-center text-center items-center">
        <button onClick={() => setHotSpotModal(true)} className="flex px-4 py-2 items-center justify-center rounded-md text-2xl text-black bg-tealblue">
          Upload Images
        </button>
      </div>
      <HotspotImage
        showModal={hotSpotModal}
        setShowModal={setHotSpotModal}
      />
    </>
  );
}

export default App;
