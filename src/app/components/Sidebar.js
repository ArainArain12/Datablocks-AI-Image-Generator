import { useState } from 'react';
import Slider from './Slider';
export default function Sidebar() {
  const [images, setImages] = useState([null, null, null, null]);

  const handleImageChange = (index, event) => {
    const newImages = [...images];
    newImages[index] = event.target.files[0];
    setImages(newImages);
  };

  const addImageSlot = () => {
    setImages([...images, null]);
  };

  const removeImageSlot = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className="w-1/4 p-4 bg-white overflow-y-auto h-screen mb-4 pb-20">
      {/* Mode and Tokens Section */}
      <div className="mb-4 flex space-x-2">
        <div className="w-1/2">
          <h2 className="text-sm font-semibold mb-2">Modes</h2>
          <div className="flex space-x-2">
            {/* <button className="w-1/2 py-2 bg-customBG rounded-2xl">Edit</button>
            <button className="w-1/2 py-2 bg-customBG rounded-2xl">Brush</button> */}
            <img src='/assets/images/mode.png' alt='modes' className='cursor-pointer'/>


          </div>
        </div>
        <div className="w-1/2">
          <h2 className="text-sm font-semibold mb-2">Tokens</h2>
          <input
          disabled
            type="text"
            className="w-full py-2 px-3 bg-customBG rounded-2xl"
          />
        </div>
      </div>

      {/* Text Prompting Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Text Prompting</h2>
        <textarea
          className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
          rows="5"
        ></textarea>
      </div>

      {/* Visual Prompting Section */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Visual Prompting</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className=" relative">

          <div  className='bg-white p-4 rounded-2xl shadow border border-black border-2' >
            <label className="w-full mb-2 cursor-pointer block relative flex flex-col items-center">
              <input type="file" className="hidden" onChange={(event) => handleImageChange(0, event)} />
              <img src="/assets/images/upload.png" alt="Upload Image" className="mx-auto" style={{ width: '50%' }} />
              <span className="mt-2 text-sm">Your Input Image</span>
            </label>
            </div>
            <Slider label="Image Strength" />
          </div>


          {images.map((image, index) => (
            <div key={index} className=" relative">

            <div  className='bg-white p-4 rounded-2xl shadow border border-black border-2' >
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
          <div className=" relative">

<div  className='bg-white p-4 rounded-2xl shadow border border-black border-2' >
  <label className="w-full mb-2 cursor-pointer block relative flex flex-col items-center">
   
    <img onClick={addImageSlot} src="/assets/images/add.png" alt="Upload Image" className="mx-auto" style={{ width: '50%' }} />
    <span className="mt-2 text-sm">Add More </span>
  </label>
  </div>

</div>
          

         


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
        <button className="w-full py-2 bg-black text-white rounded-xl">Generate</button>
      </div>

      {/* Enhance Textarea */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Enhance</h2>
        <textarea
          className="resize-none w-full py-2 px-3 bg-customBG rounded-2xl"
          rows="4"
        ></textarea>
      </div>

      {/* Upscale Button */}
      <div className="mb-8">
        <button className="w-full py-2 bg-black text-white rounded-xl">Upscale</button>
      </div>
    </div>
  );
}
