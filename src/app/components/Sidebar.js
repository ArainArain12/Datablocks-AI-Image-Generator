import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../utils/firebaseConfig";
import axios from "axios";
import AreaOptions from "../utils/areaoptions";
import { shapes, sizes, Modes } from "../data";
import ModeOptions from "../utils/modeoptions";
export default function Sidebar({
  outputImageUrl,
  setOutputImageUrl,
  setGenerateText,
  setBaseImage,
  setMaskImage,
  maskedImageData
}) {
  // const [images, setImages] = useState([
  //   { type: "base", url: "" },
  //   { type: "mask", url: "" },
  //   { type: "reference", url: "" },
  // ]);
  const [sliderValues, setSliderValues] = useState({
    reference: [{ strength: 1, start: 0, end: 1 }],
    lightSpot: { hardness: 0.5, multiplier: 0.2 },
    lightIPAdapter: { weight: 0.5 },
    Pencil:[{ strength: 0 }, { strength: 0 }, { strength: 0 }],
    depth:{strength:0.94},
    edges:{strength:0.20}
  });
  const [spot, setSpot] = useState({ x: 150, y: 150 });
  const canvasRef = useRef(null);
  const canvasRef1 = useRef(null);
  const [angle, setAngle] = useState(0);
  const [model, setModel] = useState("Pencil");
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState(40);
  const [cfg, setCfg] = useState(10);
  const [denoise, setDenoise] = useState(0.7);
  const [shapeHeight, setShapeHeight] = useState(50);
  const [shapeWidth, setShapeWidth] = useState(50);
  const [x, setX] = useState(300);
  const [y, setY] = useState(300);
  const [referenceWeight, setReferenceWeight] = useState(0.3);
  const [materialPrompt, setMaterialPrompt] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [selectedShape, setSelectedShape] = useState("circle");
  const [selectedSize, setSelectedSize] = useState("S");
  const [polling, setPolling] = useState(true);
  const [test,setTest]=useState(1);
  // const initializeImages = () => {
  //   if (model === "Pencil") {
  //     return [
  //       { type: "base", url: "" },
  //       { type: "mask", url: "" },
  //       { type: "reference", url: "" },
  //       { type: "reference", url: "" },
  //       { type: "reference", url: "" },
  //     ];
  //   }
  //   return [
  //     { type: "base", url: "" },
  //     { type: "mask", url: "" },
  //     { type: "reference", url: "" },
  //   ];
  // };

  // const [images, setImages] = useState(initializeImages());
  const [images, setImages] = useState([

  ]);
  const referenceCount = images.filter(
    (image) => image.type === "reference"
  ).length;
  // const [referenceCount, setReferenceCount] = useState(1);


  useEffect(() => {
    const initializeImages = () => {
      if (model === "Pencil") {
        return [
          { type: "base", url: "" },
          { type: "mask", url: "" },
          { type: "reference", url: "" },
          { type: "reference", url: "" },
          { type: "reference", url: "" },
        ];
      }
      return [
        { type: "base", url: "" },
        { type: "mask", url: "" },
        { type: "reference", url: "" },
      ];
    };

    const newImages = initializeImages();
    setImages(newImages);
    // setReferenceCount(newImages.filter((image) => image.type === "reference").length);
  }, [model]);

  

  useEffect(() => {
    if (model == "Light_Simple") {
      const canvas = canvasRef1.current;
      const ctx = canvas.getContext("2d");
      let isDragging = false;

      const draw = (spot) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(
          spot.x,
          spot.y,
          0,
          spot.x,
          spot.y,
          100
        );
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      const handleMouseDown = (e) => {
        isDragging = true;
        updateSpot(e);
      };

      const handleMouseMove = (e) => {
        if (isDragging) {
          updateSpot(e);
        }
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const updateSpot = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSpot({ x, y });
        draw({ x, y });
      };

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mouseleave", handleMouseUp);

      // Initial draw
      draw(spot);

      // Cleanup on unmount or when model changes
      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseleave", handleMouseUp);
      };
    }
  }, [spot, model]); // Add model to the dependency array

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   let isDragging = false;

  //   const draw = (angle) => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.beginPath();
  //     ctx.moveTo(canvas.width / 2, canvas.height / 2);
  //     const x = canvas.width / 2 + (canvas.width / 2 - 10) * Math.cos(angle);
  //     const y = canvas.height / 2 - (canvas.height / 2 - 10) * Math.sin(angle);
  //     ctx.lineTo(x, y);
  //     ctx.stroke();
  //     ctx.closePath();
  //     ctx.beginPath();
  //     ctx.arc(x, y, 5, 0, 2 * Math.PI);
  //     ctx.fill();
  //     ctx.closePath();
  //   };

  //   const handleMouseDown = (e) => {
  //     isDragging = true;
  //     updateAngle(e);
  //   };

  //   const handleMouseMove = (e) => {
  //     if (isDragging) {
  //       updateAngle(e);
  //     }
  //   };

  //   const handleMouseUp = () => {
  //     isDragging = false;
  //   };

  //   const updateAngle = (e) => {
  //     const rect = canvas.getBoundingClientRect();
  //     const x = e.clientX - rect.left - canvas.width / 2;
  //     const y = canvas.height / 2 - (e.clientY - rect.top);
  //     const angle = Math.atan2(y, x);
  //     setAngle(angle);
  //     draw(angle);
  //   };

  //   canvas.addEventListener('mousedown', handleMouseDown);
  //   canvas.addEventListener('mousemove', handleMouseMove);
  //   canvas.addEventListener('mouseup', handleMouseUp);
  //   canvas.addEventListener('mouseleave', handleMouseUp);

  //   draw(angle);

  //   return () => {
  //     canvas.removeEventListener('mousedown', handleMouseDown);
  //     canvas.removeEventListener('mousemove', handleMouseMove);
  //     canvas.removeEventListener('mouseup', handleMouseUp);
  //     canvas.removeEventListener('mouseleave', handleMouseUp);
  //   };
  // }, [angle]);

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const localURL = URL.createObjectURL(file);
      console.log("localURL", localURL);
  
      const newImages = [...images];
      newImages[index] = { ...newImages[index], url: localURL, file };
      setImages(newImages);
  
      // Check if the uploaded image is a mask image and update the state
      if (newImages[index].type === "mask") {
        setMaskImage(localURL);
      }
    }
  };


  const addImageSlot = () => {
    if (images.filter((image) => image.type === "reference").length < 4) {
      setImages([...images, { type: "reference", url: "" }]);
      setSliderValues((prevValues) => ({
        ...prevValues,
        reference: [...prevValues.reference, { strength: 0, start: 0, end: 0 }],
      }));
    } else {
      alert("Only 4 reference images can be added!");
    }
  };

  const removeImageSlot = (index) => {
    if (images.length > 3 || model !== "Brush") {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      const newSliderValues = { ...sliderValues };
      newSliderValues.reference = newSliderValues.reference.filter(
        (_, i) => i !== index - 2
      );
      setSliderValues(newSliderValues);
    } else {
      alert("At least one reference image is needed in brush mode!");
    }
  };
  const [error, setError] = useState("");
  const handleSliderChange = (type, index, sliderName, value) => {
    setSliderValues((prevValues) => {
      const newValues = { ...prevValues };
      const floatValue = parseFloat(value);

      if (type === "reference") {
        const updatedReference = [...newValues.reference];
        const currentRef = updatedReference[index];

        if (sliderName === "start" && floatValue >= currentRef.end) {
          setError("Start value must be less than End value.");
          return prevValues;
        } else if (sliderName === "end" && floatValue <= currentRef.start) {
          setError("End value must be greater than Start value.");
          return prevValues;
        } else {
          setError("");
          updatedReference[index] = { ...currentRef, [sliderName]: floatValue };
        }

        newValues.reference = updatedReference;
      } else if (type === "lightSpot") {
        newValues.lightSpot = {
          ...newValues.lightSpot,
          [sliderName]: floatValue,
        };
      } else if (type === "lightIPAdapter") {
        newValues.lightIPAdapter = {
          ...newValues.lightIPAdapter,
          [sliderName]: floatValue,
        };
        
      }
      else if (type === "Pencil") {
        console.log('Slider type Pencil Called;')
        console.log(floatValue)
        console.log('index',index)
        const updatedPencil = [...newValues.Pencil];
        updatedPencil[index] = {
          ...updatedPencil[index],
          [sliderName]: floatValue,
        };
        newValues.Pencil = updatedPencil;
        
      }
      else if (type === "depth") {
        newValues.depth = {
          ...newValues.depth,
          [sliderName]: floatValue,
        };
        
      }
      else if (type === "edges") {
        newValues.edges = {
          ...newValues.edges,
          [sliderName]: floatValue,
        };
        
      }

      return newValues;
    });
  };
  const handleGenerate = async () => {
    console.log("Images are:", images);
    const apiEndpoint = "https://api.runpod.ai/v2/scj1cqwix6bder/run";
    const bearerToken = "MRE40ZT3COAASVHZ9AAUMYDY0NZMWM4CBIB9C5C0";
  
    const uploadImage = async (file) => {
      console.log("File is:", file, file.name);
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    };
  
    const newImages = await Promise.all(
      images.map(async (image) => {
        if (image.file) {
          console.log("Image files are:", image.file);
          const url = await uploadImage(image.file);
          return { ...image, url: url };
        }
        return image;
      })
    );
  
    setImages(newImages);
  
    const baseImage = newImages.find((img) => img.type === "base")?.url;
  
    // Upload the masked image data
    let maskedImageURL = null;
    if (maskedImageData) {
      const maskedImageDataBlob = await (await fetch(maskedImageData)).blob();
      const maskedImageFile = new File([maskedImageDataBlob], "masked_image.png");
      maskedImageURL = await uploadImage(maskedImageFile);
    }
  
    if (model === "Brush") {
      if (!baseImage || !maskedImageURL) {
        alert("Base image and mask image are required for the Brush model.");
        return;
      }
    } else {
      if (!baseImage) {
        alert("Base image is required.");
        return;
      }
    }
  
    let payload = {};
    let referenceImages = [];
  
    if (model === 'Brush') {
      referenceImages = newImages
        .filter((image) => image.type === "reference")
        .map((image, index) => ({
          image: image.url,
          strength: sliderValues.reference[index]?.strength || 0,
          start_at: sliderValues.reference[index]?.start || 0,
          end_at: sliderValues.reference[index]?.end || 0,
          mask: maskedImageURL || "",
        }));
  
      const defaultReferenceImage = {
        image: baseImage || "",
        strength: 0,
        start_at: 0,
        end_at: 1,
        mask: maskedImageURL || "",
      };
  
      while (referenceImages.length < 4) {
        referenceImages.push(defaultReferenceImage);
      }
    }
    if(model==='Pencil')
    {
      
      referenceImages = newImages
      .filter((image) => image.type === "reference")
      .map((image, index) => ({
        image: image.url,
        strength: sliderValues.Pencil[index]?.strength || 0,
      }));
    }
    for (let i=0;i<sliderValues.Pencil.length;i+=1){
      console.log(sliderValues.Pencil[i])
    }
  
    switch (model) {
      case "Pencil":
        payload = {
          input: {
            model: "Pencil",
            prompt: prompt,
            steps: steps,
            cfg: cfg,
            base_image: baseImage,
            depth_map_strength:sliderValues.depth.strength,
            line_art_strength:sliderValues.edges.strength,
            ip_adapter_configurations: referenceImages,
          },
        };
        break;
      case "Brush":
        payload = {
          input: {
            model: "Brush",
            prompt: prompt,
            steps: steps,
            cfg: cfg,
            denoise: denoise,
            base_image: baseImage,
            ip_adapter_configurations: referenceImages,
          },
        };
        break;
      case "Light_Simple":
        const image_found = newImages.find(
          (img) => img.type === "reference"
        )?.url;
        payload = {
          input: {
            model: image_found ? "Light_IPAdapter" : "Light_Simple",
            prompt: prompt,
            input_image: baseImage,
            multiplier: sliderValues.lightSpot["multiplier"],
            hardness: sliderValues.lightSpot["hardness"],
            shape_height: shapeHeight,
            shape_width: shapeWidth,
            shape: selectedShape || "circle",
            x: spot["x"],
            y: spot["y"],
            ...(image_found && {
              reference_image: image_found,
              reference_weight: sliderValues.lightIPAdapter["weight"],
            }),
          },
        };
        break;
      case "Upscale_Detail":
        payload = {
          input: {
            input_image: baseImage,
            model: "Upscale_Detail",
            material_prompt: materialPrompt,
            enhance_prompt: enhancePrompt,
          },
        };
        break;
      default:
        console.error("Invalid model selected");
        return;
    }
  
    console.log("Payload:", payload);
  
  
  
    try {
      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);

      const jobId = response.data.id;
      setPolling(true);
      setGenerateText("Generating Image.........");
      pollForStatus(jobId);
    } catch (error) {
      console.error("Error generating image:", error);
      setGenerateText(null);
    }
  };

  const pollForStatus = async (jobId) => {
    const apiStatusEndpoint = `https://api.runpod.ai/v2/scj1cqwix6bder/status/${jobId}`;
    const bearerToken = "MRE40ZT3COAASVHZ9AAUMYDY0NZMWM4CBIB9C5C0";

    try {
      const response = await axios.get(apiStatusEndpoint, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Status Response:", response.data);

      if (response.data.status === "COMPLETED") {
        setGenerateText(null);
        setBaseImage(images.find(
          (img) => img.type === "base"
        )?.url)
        setOutputImageUrl(response.data.output[0]);
        setPolling(false);
      } else if (polling) {
        setTimeout(() => pollForStatus(jobId), 5000);
      }
      else if(response.data.status === "FAILED"){
        setGenerateText(null);
        setPolling(false);
      }
    } catch (error) {
      console.error("Error polling status:", error);
      setPolling(false);
      setGenerateText(null);
    }
  };

  const handleUpscale = async () => {
    if (outputImageUrl) {
      let payload = {};
      payload = {
        input: {
          model: "Upscale_Simple",
          input_image: outputImageUrl,
        },
      };
      const apiEndpoint = "https://api.runpod.ai/v2/scj1cqwix6bder/run";
      const bearerToken = "MRE40ZT3COAASVHZ9AAUMYDY0NZMWM4CBIB9C5C0";
      try {
        const response = await axios.post(apiEndpoint, payload, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response:", response.data);

        const jobId = response.data.id;
        setPolling(true);
        pollForStatus(jobId);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    } else {
      alert("Cannot use upscale!");
    }
  };

  
  return (
    <div className="w-1/4 p-4 bg-white overflow-y-auto h-screen mb-4 pb-20">
      {/* Mode Selection */}
      <div className="mb-4">
        <ModeOptions
          data={Modes}
          heading={"Modes"}
          selectedOption={model}
          setSelectedOption={setModel}
        ></ModeOptions>
      </div>
      {/* Text Prompting Section */}
      {model !== "Upscale_Detail" && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-2">Text Prompting</h2>
          <textarea
            className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
            rows="5"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </div>
      )}
      {/* Visual Prompting Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">
          {model == "Upscale_Detail"
            ? "Texture to upscale"
            : "Visual Prompting"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
  {images.map((image, index) => {
    if (model === "Upscale_Detail" && image.type !== "base") {
      return null;
    }
    return model === "Brush" || image.type !== "mask" ? (
      <div key={index} className="relative">
        <div className="bg-white p-4 rounded-2xl shadow border border-black border-2">
          <label className="w-full mb-2 cursor-pointer block relative flex flex-col items-center">
            <input
              type="file"
              className="hidden"
              onChange={(event) => handleImageChange(index, event)}
            />
            <img
              src={image.url || "/assets/images/upload.png"}
              alt="Upload Image"
              className="mx-auto"
              style={{ width: "50%" }}
            />
            <span className="mt-2 text-sm">
              {image.type === "base"
                ? "Your Input Image"
                : image.type === "mask"
                ? "Your Mask Image"
                : `Image Ref # ${index - 1}`}
            </span>
          </label>
          {image.type !== "base" &&
            image.type !== "mask" &&
            referenceCount > 1 && model==='Brush' && (
              <img
                onClick={() => removeImageSlot(index)}
                className="absolute top-2 right-2 bg-transparent text-white rounded-2xl cursor-pointer"
                src="/assets/images/delete.png"
                style={{ width: "20%" }}
                alt="Delete"
              />
            )}
        </div>
        {model === "Brush" &&
          image.type !== "base" &&
          image.type !== "mask" && (
            <>
              <Slider
                label="Strength"
                value={sliderValues.reference[index - 2]?.strength || 0}
                min={0.8}
                max={1.3}
                initialValue={1}
                onChange={(value) =>
                  handleSliderChange("reference", index - 2, "strength", value)
                }
              />
              <Slider
                label="Start"
                value={sliderValues.reference[index - 2]?.start || 0}
                initialValue={0}
                onChange={(value) =>
                  handleSliderChange("reference", index - 2, "start", value)
                }
              />
              <Slider
                label="End"
                value={sliderValues.reference[index - 2]?.end || 0}
                initialValue={1}
                onChange={(value) =>
                  handleSliderChange("reference", index - 2, "end", value)
                }
              />
            </>
          )}
        {model === "Light_Simple" && image.type === "reference" && (
          <Slider
            label="Weight"
            max={0.8}
            value={sliderValues.lightIPAdapter?.weight || 0}
            onChange={(value) =>
              handleSliderChange("lightIPAdapter", 0, "weight", value)
            }
          />
        )}
         {model === "Pencil" && image.type === "reference" && (
          <Slider
            label="Strength"
            max={0.8}
            value={sliderValues.Pencil[index-2]?.strength || 0}
            onChange={(value) =>
              handleSliderChange("Pencil", index-2, "strength", value)
            }
          />
        )}
      </div>
    ) : null;
  })}

  {model === "Brush" && (
    <div className="relative">
      <div className="bg-white p-4 rounded-2xl shadow border border-black border-2">
        <label className="w-full mb-2 cursor-pointer block relative flex flex-col items-center">
          <img
            onClick={addImageSlot}
            src="/assets/images/add.png"
            alt="Add More"
            className="mx-auto"
            style={{ width: "50%" }}
          />
          <span className="mt-2 text-sm">Add More</span>
        </label>
      </div>
    </div>
  )}
  </div>
  </div>


      {error && <p className="text-red-500">{error}</p>}
      {model === "Light_Simple" && (
        <>
          <div>
            <Slider
              label="Light Multiplier"
              className="mb-2"
              value={sliderValues.lightSpot.strength}
              min={0}
              max={0.3}
              initialValue={0}
              onChange={(value) =>
                handleSliderChange("lightSpot", 0, "strength", value)
              }
            />
            <Slider
              label="Light Hardness"
              className="mb-2"
              min={0}
              max={0.2}
              step={0.01}
              initialValue={0.18}
              value={sliderValues.lightSpot.start}
              onChange={(value) =>
                handleSliderChange("lightSpot", 0, "start", value)
              }
            />
          </div>

          <div className="mt-14 mb-12">
            <AreaOptions
              data={shapes}
              heading="Area light shape"
              selectedOption={selectedShape}
              setSelectedOption={setSelectedShape}
            />
            <AreaOptions
              data={sizes}
              heading="Area light size"
              selectedOption={selectedSize}
              setSelectedOption={setSelectedSize}
              setShapeHeight={setShapeHeight}
              setShapeWidth={setShapeWidth}
            />
          </div>
        </>
      )}

      {/* Light Angle Section  */}
      {/* <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Light Angle</h2>
        <div className="bg-white p-2 rounded-2xl shadow mb-4 border border-2 border-black flex items-center justify-center">
          <div className="p-0 w-full bg-customBG1 flex items-center justify-center rounded-lg">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              style={{ backgroundColor: '#444', borderRadius: '8px' }}
            />
          </div>
        </div>
        <div>
          <Slider
            label="Strength"
            className="mb-2"
            onChange={(value) => handleSliderChange('Light_Angle', { strength: value })}
          />
          <Slider
            label="Starts"
            className="mb-2"
            onChange={(value) => handleSliderChange('Light_Angle', { starts: value })}
          />
          <Slider
            label="Ends"
            className="mb-2"
            onChange={(value) => handleSliderChange('Light_Angle', { ends: value })}
          />
        </div>
      </div> */}
      {/* Light Spot Section */}
      {model == "Light_Simple" && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-2">Light Spot</h2>
          <div className="bg-white p-2 rounded-2xl shadow mb-4 border border-2 border-black flex items-center justify-center">
            <div className="p-0 w-full bg-customBG1 flex items-center justify-center rounded-lg">
              <canvas
                ref={canvasRef1}
                width={300}
                height={300}
                style={{ backgroundColor: "#333", borderRadius: "8px" }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Depth Map Section */}
     

      {model=='Pencil' &&(
      <><div className="mb-4">
          <h2 className="text-sm font-semibold mb-2">Depth Map</h2>
          <div className="bg-white p-2 rounded-2xl shadow mb-4 border border-2 border-black flex items-center justify-center">
            <div className="p-20 w-full bg-customBG1 flex items-center justify-center rounded-lg">
              <img src="/assets/images/depth.png" alt="Depth Map Preview" style={{ width: '40%' }} />
            </div>
          </div>
          <div>
            <Slider
              label="Strength"
              className="mb-2"
              initialValue={0.94}
              max={1}
              step={0.01}
              onChange={(value) =>
                handleSliderChange("depth", 0, "strength", value)
              }
              ></Slider>
            {/* <Slider
              label="Starts"
              className="mb-2"
              onChange={(value) => handleSliderChange('Depth_Map', { starts: value })} />
            <Slider
              label="Ends"
              className="mb-2"
              onChange={(value) => handleSliderChange('Depth_Map', { ends: value })} /> */}
          </div>
        </div><div className="mb-4">
            <h2 className="text-sm font-semibold mb-2">Edges</h2>
            <div className="bg-white p-2 rounded-2xl shadow mb-4 border border-2 border-black flex items-center justify-center">
              <div className="p-20 w-full bg-customBG1 flex items-center rounded-lg justify-center">
                <img src="/assets/images/edges.png" alt="Edges Preview" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <Slider
                label="Strength"
                className="mb-2"
                initialValue={0.20}
                max={1}
                step={0.01}
                onChange={(value) =>
                  handleSliderChange("edges", 0, "strength", value)
                }
                ></Slider>
              {/* <Slider
                label="Starts"
                className="mb-2"
                onChange={(value) => handleSliderChange('Edges', { starts: value })} />
              <Slider
                label="Ends"
                className="mb-2"
                onChange={(value) => handleSliderChange('Edges', { ends: value })} /> */}
            </div>
          </div></>    

      
     )}
      {/* Render Engine Section */}
      {(model === "Brush" || model === "Pencil") && (
  <div className="mb-4">
    <h2 className="text-sm font-semibold mb-2">Render Engine</h2>
    <div>
      <Slider
        label="CFG"
        className="mb-2"
        min={8}
        max={12}
        step={1}
        initialValue={10}
        onChange={(value) => setCfg(parseFloat(value))}
      />
      <Slider
        label="Steps"
        className="mb-2"
        min={20}
        max={40}
        step={1}
        initialValue={40}
        onChange={(value) => setSteps(parseFloat(value))}
      />
      {model === "Brush" && (
        <Slider
          label="Denoise"
          min={0}
          max={1}
          initialValue={0.7}
          className="mb-2"
          onChange={(value) => setDenoise(parseFloat(value))}
        />
      )}
    </div>
  </div>
)}
 {model == "Upscale_Detail" && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-2">
            Describe the material or texture:
          </h2>
          <textarea
            className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
            rows="4"
            value={materialPrompt}
            onChange={(e) => setMaterialPrompt(e.target.value)}
          ></textarea>
        </div>
      )}
      {model == "Upscale_Detail" && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-2">Details to enhance</h2>
          <textarea
            className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
            rows="4"
            value={enhancePrompt}
            onChange={(e) => setEnhancePrompt(e.target.value)}
          ></textarea>
        </div>
      )}

      {/* Generate Button */}
      
        <div className="mb-4">
          <button
            className="w-full py-2 bg-black text-white rounded-xl"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>
    
      {/* Enhance Textarea */}
      {model !== "Upscale_Detail" && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-2">Enhance</h2>
          <textarea
            className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
            rows="4"
            value={enhancePrompt}
            onChange={(e) => setEnhancePrompt(e.target.value)}
          ></textarea>
        </div>
      )}
     
      {/* Upscale Button */}
      <div className="mb-8">
        <button
          className="w-full py-2 bg-black text-white rounded-xl"
          onClick={handleUpscale}
        >
          Upscale
        </button>
      </div>
    </div>
  );
}
