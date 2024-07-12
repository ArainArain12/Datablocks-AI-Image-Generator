import { useEffect, useRef, useState } from 'react';
import Slider from './Slider';
import { storage, ref,getDownloadURL,uploadBytes } from '../utils/firebaseConfig';
import axios from 'axios';

export default function Sidebar() {
  const [images, setImages] = useState([null, null, null, null]);
  const [spot, setSpot] = useState({ x: 150, y: 150 });
  const canvasRef = useRef(null);
  const canvasRef1 = useRef(null);
  const [angle, setAngle] = useState(0);
  const [baseImageURL, setBaseImageURL] = useState('');
  const [maskImageURL, setMaskImageURL] = useState('');
  const [referenceImageURLs, setReferenceImageURLs] = useState([]);
  const [model, setModel] = useState('Brush');
  const [prompt, setPrompt] = useState('');
  const [steps, setSteps] = useState(40);
  const [cfg, setCfg] = useState(10);
  const [denoise, setDenoise] = useState(0.7);
  const [multiplier, setMultiplier] = useState(0.18);
  const [hardness, setHardness] = useState(0);
  const [shape, setShape] = useState('square');
  const [shapeHeight, setShapeHeight] = useState(256);
  const [shapeWidth, setShapeWidth] = useState(256);
  const [x, setX] = useState(300);
  const [y, setY] = useState(300);
  const [referenceWeight, setReferenceWeight] = useState(0.3);
  const [materialPrompt, setMaterialPrompt] = useState('');
  const [enhancePrompt, setEnhancePrompt] = useState('');

  useEffect(() => {
    const canvas = canvasRef1.current;
    const ctx = canvas.getContext('2d');
    let isDragging = false;

    const draw = (spot) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, 100);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, 'black');

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

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    draw(spot);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [spot]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let isDragging = false;

    const draw = (angle) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      const x = canvas.width / 2 + (canvas.width / 2 - 10) * Math.cos(angle);
      const y = canvas.height / 2 - (canvas.height / 2 - 10) * Math.sin(angle);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      updateAngle(e);
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        updateAngle(e);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const updateAngle = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = canvas.height / 2 - (e.clientY - rect.top);
      const angle = Math.atan2(y, x);
      setAngle(angle);
      draw(angle);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    draw(angle);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [angle]);

  const handleImageChange = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);
  
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
  
      if (index === 0) {
        setBaseImageURL(fileURL);
      } else {
        const newReferenceImageURLs = [...referenceImageURLs];
        newReferenceImageURLs[index - 1] = fileURL;
        setReferenceImageURLs(newReferenceImageURLs);
      }
    }
  };
  

  const addImageSlot = () => {
    setImages([...images, null]);
  };

  const removeImageSlot = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (index === 0) {
      setBaseImageURL('');
    } else {
      const newReferenceImageURLs = referenceImageURLs.filter((_, i) => i !== index - 1);
      setReferenceImageURLs(newReferenceImageURLs);
    }
  };

  const handleGenerate = async () => {
    let payload = {};
    let apiEndpoint = '';

    switch (model) {
      case 'Brush':
        payload = {
          input: {
            model: "Brush",
            prompt: prompt,
            steps: steps,
            cfg: cfg,
            denoise: denoise,
            base_image: baseImageURL,
            mask_image: maskImageURL,
            ip_adapter_configurations: referenceImageURLs.map((url) => ({
              image: url,
              strength: 1,
              start_at: 0,
              end_at: 1,
            })),
          },
        };
        apiEndpoint = 'https://backend.example.com/brush';
        break;
      case 'Light_Simple':
        payload = {
          input: {
            model: "Light_Simple",
            prompt: prompt,
            input_image: baseImageURL,
            multiplier: multiplier,
            hardness: hardness,
            shape_height: shapeHeight,
            shape_width: shapeWidth,
            shape: shape,
            x: x,
            y: y,
          },
        };
        apiEndpoint = 'https://backend.example.com/light_simple';
        break;
      case 'Light_IPAdapter':
        payload = {
          input: {
            model: "Light_IPAdapter",
            prompt: prompt,
            input_image: baseImageURL,
            multiplier: multiplier,
            hardness: hardness,
            shape_height: shapeHeight,
            shape_width: shapeWidth,
            shape: shape,
            x: x,
            y: y,
            reference_image: referenceImageURLs[0],
            reference_weight: referenceWeight,
          },
        };
        apiEndpoint = 'https://backend.example.com/light_ipadapter';
        break;
      case 'Upscale_Simple':
        payload = {
          input: {
            input_image: baseImageURL,
            model: "Upscale_Simple",
          },
        };
        apiEndpoint = 'https://backend.example.com/upscale_simple';
        break;
      case 'Upscale_Detail':
        payload = {
          input: {
            input_image: baseImageURL,
            model: "Upscale_Detail",
            material_prompt: materialPrompt,
            enhance_prompt: enhancePrompt,
          },
        };
        apiEndpoint = 'https://backend.example.com/upscale_detail';
        break;
      default:
        break;
    }

    try {
      const response = await axios.post(apiEndpoint, payload);
      console.log(response.data);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="w-1/4 p-4 bg-white overflow-y-auto h-screen mb-4 pb-20">
      {/* Mode Selection */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Mode</h2>
        <select
          className="w-full py-2 px-3 bg-customBG rounded-2xl"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="Brush">Brush</option>
          <option value="Light_Simple">Light Simple</option>
          <option value="Light_IPAdapter">Light IP Adapter</option>
          <option value="Upscale_Simple">Simple Upscale</option>
          <option value="Upscale_Detail">Detailed Upscale</option>
        </select>
      </div>

      {/* Text Prompting Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Text Prompting</h2>
        <textarea
          className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
          rows="5"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
      </div>

      {/* Visual Prompting Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Visual Prompting</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className='bg-white p-4 rounded-2xl shadow border border-black border-2'>
              <label className="w-full mb-2 cursor-pointer block relative flex flex-col items-center">
                <input type="file" className="hidden" onChange={(event) => handleImageChange(0, event)} />
                <img src="/assets/images/upload.png" alt="Upload Image" className="mx-auto" style={{ width: '50%' }} />
                <span className="mt-2 text-sm">Your Input Image</span>
              </label>
            </div>
            <Slider label="Image Strength" />
          </div>

          {images.map((image, index) => (
            <div key={index} className="relative">
              <div className='bg-white p-4 rounded-2xl shadow border border-black border-2'>
                <label className="w-full mb-2 cursor-pointer block relative flex flex-col items-center">
                  <input type="file" className="hidden" onChange={(event) => handleImageChange(index, event)} />
                  <img src="/assets/images/upload.png" alt="Upload Image" className="mx-auto" style={{ width: '50%' }} />
                  <span className="mt-2 text-sm">Image Ref # {index + 1}</span>
                </label>
                <img
                  onClick={() => removeImageSlot(index)}
                  className="absolute top-2 right-2 bg-transparent text-white rounded-2xl cursor-pointer"
                  src="/assets/images/delete.png"
                  style={{ width: '20%' }}
                  alt="Delete"
                />
              </div>
              <Slider label="Image Strength" />
            </div>
          ))}

          {/* Add More Images Button */}
          <div className="relative">
            <div className='bg-white p-4 rounded-2xl shadow border border-black border-2'>
              <label className="w-full mb-2 cursor-pointer block relative flex flex-col items-center">
                <img onClick={addImageSlot} src="/assets/images/add.png" alt="Upload Image" className="mx-auto" style={{ width: '50%' }} />
                <span className="mt-2 text-sm">Add More</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Light Angle Section */}
      <div className="mb-4">
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
          <Slider label="Strength" className="mb-2" />
          <Slider label="Starts" className="mb-2" />
          <Slider label="Ends" className="mb-2" />
        </div>
      </div>

      {/* Light Spot Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Light Spot</h2>
        <div className="bg-white p-2 rounded-2xl shadow mb-4 border border-2 border-black flex items-center justify-center">
          <div className="p-0 w-full bg-customBG1 flex items-center justify-center rounded-lg">
            <canvas
              ref={canvasRef1}
              width={300}
              height={300}
              style={{ backgroundColor: '#333', borderRadius: '8px' }}
            />
          </div>
        </div>
        <div>
          <Slider label="Strength" className="mb-2" />
          <Slider label="Starts" className="mb-2" />
          <Slider label="Ends" className="mb-2" />
        </div>
      </div>

      {/* Depth Map Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Depth Map</h2>
        <div className="bg-white p-2 rounded-2xl shadow mb-4 border border-2 border-black flex items-center justify-center">
          <div className="p-20 w-full bg-customBG1 flex items-center justify-center rounded-lg">
            <img src="/assets/images/depth.png" alt="Depth Map Preview" style={{ width: '40%' }} />
          </div>
        </div>
        <div>
          <Slider label="Strength" className="mb-2" />
          <Slider label="Starts" className="mb-2" />
          <Slider label="Ends" className="mb-2" />
        </div>
      </div>

      {/* Edges Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Edges</h2>
        <div className="bg-white p-2 rounded-2xl shadow mb-4 border border-2 border-black flex items-center justify-center">
          <div className="p-20 w-full bg-customBG1 flex items-center rounded-lg justify-center">
            <img src="/assets/images/edges.png" alt="Edges Preview" style={{ width: '40%' }} />
          </div>
        </div>
        <div>
          <Slider label="Strength" className="mb-2" />
          <Slider label="Starts" className="mb-2" />
          <Slider label="Ends" className="mb-2" />
        </div>
      </div>

      {/* Render Engine Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Render Engine</h2>
        <div>
          <Slider label="CFG" className="mb-2" />
          <Slider label="Steps" className="mb-2" />
          <Slider label="Denoise" className="mb-2" />
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-4">
        <button className="w-full py-2 bg-black text-white rounded-xl" onClick={handleGenerate}>Generate</button>
      </div>

      {/* Enhance Textarea */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Enhance</h2>
        <textarea
          className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
          rows="4"
          value={enhancePrompt}
          onChange={(e) => setEnhancePrompt(e.target.value)}
        ></textarea>
      </div>

      {/* Upscale Button */}
      <div className="mb-8">
        <button className="w-full py-2 bg-black text-white rounded-xl">Upscale</button>
      </div>
    </div>
  );
}
