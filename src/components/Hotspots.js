import React, { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

const HotspotImage = ({ showModal, setShowModal }) => {
  const [hotspotData, setHotspotData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [imageList, setImageList] = useState([]);
  const [comment, setComment] = useState("");
  const [inputValues, setInputValues] = useState([]);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [commentStates, setCommentStates] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [fileName, setFileName] = useState("");
  const [editStates, setEditStates] = useState([]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImageList = [];
    const newHotSpotData = [];
    const newInputValues = [];
    const newComments = [];
    const newCommentStates = [];
    const newEditStates = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageList.push(reader.result);
        newHotSpotData.push([]);
        newInputValues.push([]);
        newComments.push([]);
        newComments[i]["filename"] = file.name;
        newCommentStates.push(Array(newHotSpotData.length).fill(false));
        newEditStates.push([]);
        if (i === files.length - 1) {
          setSelectedImage(newImageList[0]);
          setFileName(files[0].name);
          setActiveImage(0);
          setImageList(newImageList);
          setHotspotData(newHotSpotData);
          setInputValues(newInputValues);
          setComments(newComments);
          setCommentStates(newCommentStates);
          setEditStates(newEditStates);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (index) => {
    if (imageList[index]) {
      setSelectedImage(imageList[index]);
      setFileName(comments[index].filename);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setImageList([]);
    setFileInputKey(Date.now());
    setHotspotData([]);
    setInputValues([""]);
    setComments([]);
    setActiveImage(null);
    setFileName("");
  };

  const handleTextareaChange = (event, imageIndex, hotspotIndex) => {
    // Update the textarea value for this hotspot
    const newInputValues = [...inputValues];
    newInputValues[imageIndex][hotspotIndex] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleAddComment = (imageIndex, hotspotIndex) => {
    const updatedComments = [...comments];
    if (!updatedComments[imageIndex]) {
      updatedComments[imageIndex] = [];
    }

    const hotspotComment = {
      hotspot: hotspotData[imageIndex][hotspotIndex],
      comment: inputValues[imageIndex][hotspotIndex] || "",
    };

    const existingCommentIndex = updatedComments[imageIndex].findIndex(
      (comment) => comment.hotspot === hotspotComment.hotspot
    );
    if(existingCommentIndex !== -1){
      updatedComments[imageIndex][existingCommentIndex] = hotspotComment;
    } else {
      updatedComments[imageIndex].push(hotspotComment);
    }

    setComments(updatedComments);
    const newCommentStates = [...commentStates];
    newCommentStates[imageIndex][hotspotIndex] = true;
    setCommentStates(newCommentStates);

    const newEditStates = [...editStates];
    newEditStates[imageIndex][hotspotIndex] = false; // Set edit state to false
    setEditStates(newEditStates);
    // setInputValues([""]);
  };

  const handleRemoveHotspot = (imageIndex, hotspotIndex) => {
    const updatedHotspots = [...hotspotData];
    updatedHotspots[imageIndex].splice(hotspotIndex, 1);
    setHotspotData(updatedHotspots);

    const updatedComments = [...comments];
    if (updatedComments[imageIndex]) {
      updatedComments[imageIndex].splice(hotspotIndex, 1);

      const updatedInputValues = [...inputValues];
      if (updatedInputValues[imageIndex]) {
        updatedInputValues[imageIndex].splice(hotspotIndex, 1);
      }

      const newHotspotData = [...hotspotData];
      newHotspotData[imageIndex] = updatedHotspots;

      const newComments = [...comments];
      newComments[imageIndex] = updatedComments;

      const newInputValues = [...inputValues];
      newInputValues[imageIndex] = updatedInputValues;

      const newCommentStates = [...commentStates];
      newCommentStates[imageIndex].splice(hotspotIndex, 1);

      const newEditStates = [...editStates];
      newEditStates[imageIndex].splice(hotspotIndex, 1);

      setComments(updatedComments);
      setInputValues(updatedInputValues);
      setCommentStates(newCommentStates);
      setEditStates(newEditStates);
    }
  };

  const handleEditComment = (imageIndex, hotspotIndex) => {
    const newEditStates = [...editStates];
    newEditStates[imageIndex][hotspotIndex] = true; // Set edit state to true
    setEditStates(newEditStates);
  };

  const handleImageClick = (event, imageIndex) => {
    const rect = event.target.getBoundingClientRect();
    const xCoord = ((event.clientX - rect.left) / rect.width) * 100;
    const yCoord = ((event.clientY - rect.top) / rect.height) * 100;

    const updatedHotspots = [...hotspotData];
    updatedHotspots[imageIndex].push({ x: xCoord, y: yCoord });
    setHotspotData(updatedHotspots);
    setComment("");
    setX(xCoord);
    setY(yCoord);

    const newEditStates = [...editStates];
    newEditStates[imageIndex].push(true);
    setEditStates(newEditStates);
  };

  const calcuateScale = () => {
    if (imageRef.current && containerRef.current) {
      const imageWidth = imageRef.current.width;
      const imageHeight = imageRef.current.height;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const scaleX = containerWidth / imageWidth;
      const scaleY = containerHeight / imageHeight;

      setScaleX(scaleX);
      setScaleY(scaleY);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", calcuateScale);
    return () => {
      window.removeEventListener("resize", calcuateScale);
    };
  }, []);

  console.log(comments);

  return (
    <>
      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            showModal ? "bg-black bg-opacity-50" : ""
          }`}
        >
          <div
            className={`flex flex-col ${
              selectedImage === null
                ? ""
                : "2xl:h-[800px] xl:h-[600px] 2xl:max-w-max xl:max-w-7xl"
            } bg-white rounded-md p-4`}
          >
            <div
              className={`${
                selectedImage === null ? "" : "flex flex-row gap-2"
              } w-full h-full`}
            >
              <div
                className={`flex flex-col gap-4 ${
                  selectedImage === null
                    ? "w-full"
                    : "w-2/3 h-full justify-around"
                }`}
              >
                {selectedImage === null && (
                  <div className="flex flex-row gap-4 items-center justify-center">
                    <input
                      className="text-white"
                      type="file"
                      multiple
                      accept="*"
                      onChange={handleImageChange}
                    />
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowModal(false)}
                    >
                      <img
                        className="w-6 h-6 cursor-pointer"
                        src="https://dev-monkxperience.s3.ap-south-1.amazonaws.com/eliya/close.svg"
                        alt=""
                      />
                    </div>
                  </div>
                )}
                {selectedImage && (
                  <>
                    <div className="w-full text-center text-xl font-semibold">
                      {fileName}
                    </div>
                    <div
                      className="w-full h-4/5 relative"
                      ref={(element) => {
                        containerRef.current = element;
                        imageRef.current = element;
                      }}
                    >
                      <img
                        className="w-full h-full object-contain cursor-pointer"
                        src={selectedImage}
                        alt=""
                        onClick={(event) =>
                          handleImageClick(
                            event,
                            imageList.indexOf(selectedImage)
                          )
                        }
                      />
                      {hotspotData[imageList.indexOf(selectedImage)].map(
                        (hotspot, index) => (
                          <div
                            key={index}
                            className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer"
                            style={{
                              left: `${hotspot.x}%`,
                              top: `${hotspot.y}%`,
                            }}
                          >
                            <div className="relative left-1/2 w-full text-black rounded text-xs">
                              <TextareaAutosize
                                className="relative top-2 p-1 focus:outline-none"
                                value={
                                  inputValues[imageList.indexOf(selectedImage)][
                                    index
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleTextareaChange(
                                    e,
                                    imageList.indexOf(selectedImage),
                                    index
                                  )
                                }
                                readOnly={!editStates[imageList.indexOf(selectedImage)][index]}
                                placeholder="Add your comment..."
                              />
                              <div className="relative top-2 flex flex-row gap-2 px-2 text-black">
                                {editStates[imageList.indexOf(selectedImage)][index] ? (
                                  <button
                                    onClick={() => {
                                      handleAddComment(
                                        imageList.indexOf(selectedImage),
                                        index
                                      );
                                    }}
                                    className="flex px-2 py-0.5 font-medium bg-teal-300 rounded-sm"
                                  >
                                    Add+
                                  </button>
                                ) : (
                                  <>
                                    {/* {!editStates[imageList.indexOf(selectedImage)][index] ? ( */}
                                      <button
                                        onClick={() => {
                                          handleEditComment(
                                            imageList.indexOf(selectedImage),
                                            index
                                          );
                                        }}
                                        className="flex px-2 py-0.5 font-medium bg-teal-300 rounded-sm"
                                      >
                                        Edit
                                      </button>
                                    {/* ) : null} */}
                                  </>
                                )}
                                <button
                                  onClick={() =>
                                    handleRemoveHotspot(
                                      imageList.indexOf(selectedImage),
                                      index
                                    )
                                  }
                                  className="flex px-2 py-0.5 font-medium bg-red-300 rounded-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}
                {selectedImage && (
                  <div className="flex flex-row w-full justify-around">
                    {/* <button
                      className="flex px-4 rounded-full py-2 bg-black text-white text-2xl justify-center items-center"
                    >
                      Upload
                    </button> */}
                    <button
                      onClick={() => handleCancel()}
                      className="flex px-4 py-2 text-2xl rounded-full bg-black text-white justify-center items-center"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {selectedImage && (
                <div className="flex w-max flex-col gap-2 max-h-[700px] overflow-y-auto pr-2">
                  {/* Product selection removed */}
                </div>
              )}
              {selectedImage && (
                <div className="flex border border-gray-400"></div>
              )}
              <div className="flex flex-col w-1/3 items-center gap-4 max-h-[700px] overflow-y-auto">
                {imageList.map((image, index) => (
                  <img
                    className={`h-64 cursor-pointer ${
                      activeImage === index
                        ? "border-2 border-black"
                        : "border border-black"
                    } object-contain`}
                    key={index}
                    src={image}
                    alt=""
                    onClick={() => handleImageSelect(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HotspotImage;
