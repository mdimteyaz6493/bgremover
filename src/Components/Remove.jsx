import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { BsImageFill, BsImageAlt } from "react-icons/bs";
import { MdDownload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { RxReset } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdCrop } from "react-icons/io";
import { MdDelete } from "react-icons/md";



const Remove = () => {
  const [image, setImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [openEffects, setOpenEffects] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    saturate: 100,
    shadow: 0,
  });
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropper, setCropper] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setUploadedFile(file);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      grayscale(${filters.grayscale}%)
      saturate(${filters.saturate}%)
      ${shadowEnabled ? `drop-shadow(${filters.shadow}px ${filters.shadow}px 10px rgba(0, 0, 0, 0.5))` : ''}
    `;
    console.log('Filter string:', filterString); // Debugging line
    return filterString;
  };

  const removeBackground = async () => {
    if (!uploadedFile) {
      console.log("No image file selected");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image_file", uploadedFile);
    formData.append("size", "auto");

    const apiKey = "yxrWzeJr9DEaMVH8hDjvrbzP";

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { 'X-Api-Key': apiKey },
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to remove background: ${response.statusText}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImage(url);
    } catch (err) {
      console.error("Error removing background:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL('image/png');
      setImage(croppedImage);
      setShowCropper(false);
    }
  };

  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = applyFilters();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'edited-image.png';
      link.click();
    };
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
      saturate: 100,
      shadow: 0,
    });
    setShadowEnabled(false);
    setActiveFilter(null);
  };
const deteleIMage =()=>{
  setImage("")
}
  return (
    <section className="image-editor">
    {image && <button onClick={deteleIMage} className='del_button'><MdDelete /></button>}  
      {!image && <div className="ie_title">
        <span>Upload your Image.</span>
      </div>}

      {!image && (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <div className="drag_image">
            <BsImageFill className='icon' />
            <p>Drag 'n' drop an image here, or click to select one</p>
          </div>
        </div>
      )}

      {image && (
        <div className="edit_cont">

          <div className="image-container" style={{ backgroundColor: bgColor }}>
          <img src={image} alt="Preview" style={{ filter: applyFilters(), display: showCropper ? 'none' : 'block' }} />
            {showCropper && (
              <Cropper
                src={image}
                style={{ height: '100%', width: '100%' }}
                aspectRatio={1}
                viewMode={1}
                onInitialized={(instance) => setCropper(instance)}
                guides={false}
                cropBoxResizable={true}
                responsive={true}
              />
            )}
            {loading && (
              <div className="overlay">
                <AiOutlineLoading3Quarters className='ov_icon'/>
                <p>Processing...</p>
              </div>
            )}
          </div>

          <div className="edit_options">
            {uploadedFile && (
              <div className="filter-buttons">
                <button onClick={removeBackground}><BsImageAlt /></button>
                <span>Remove Background</span>
              </div>
            )}

            {image && (
              <>
              <div className="crop-button">
            <button onClick={() => setShowCropper(true)}><IoMdCrop /></button>
            <label>Crop</label>
        </div>
                <div className="background-color-picker">
                  <input
                    type="color"
                    id="bg-color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <label htmlFor="bg-color">Background Color</label>
                </div>

                <div className="download-button">
                  <button onClick={() => setOpenEffects(!openEffects)}>fx</button>
                  <label>Effects</label>
                </div>

                <div className="reset-button">
                  <button onClick={resetFilters}><RxReset /></button>
                  <label>Reset</label>
                </div>
               
            <div className="download-button">
                  <button onClick={downloadImage}><MdDownload /></button>
                  <label>Download</label>
                </div>
              </>
            )}

         
          </div>
             {/* Effects Dialog Box */}
             {openEffects && (
              <div className="effects-dialog">
                <div className="slider-container">
                  {/* Brightness */}
                  <div className="slider">
                    <label onClick={() => setActiveFilter('brightness')}>Brightness</label>
                    {activeFilter === 'brightness' && (
                      <input type="range" name="brightness" min="0" max="200" value={filters.brightness} onChange={handleFilterChange} className='slide' />
                    )}
                  </div>

                  {/* Contrast */}
                  <div className="slider">
                    <label onClick={() => setActiveFilter('contrast')}>Contrast</label>
                    {activeFilter === 'contrast' && (
                      <input type="range" name="contrast" min="0" max="200" value={filters.contrast} onChange={handleFilterChange} className='slide' />
                    )}
                  </div>

                  {/* Grayscale */}
                  <div className="slider">
                    <label onClick={() => setActiveFilter('grayscale')}>Grayscale</label>
                    {activeFilter === 'grayscale' && (
                      <input type="range" name="grayscale" min="0" max="100" value={filters.grayscale} onChange={handleFilterChange} className='slide' />
                    )}
                  </div>

                  {/* Saturate */}
                  <div className="slider">
                    <label onClick={() => setActiveFilter('saturate')}>Saturate</label>
                    {activeFilter === 'saturate' && (
                      <input type="range" name="saturate" min="0" max="200" value={filters.saturate} onChange={handleFilterChange} className='slide' />
                    )}
                  </div>
                  
                  {/* Shadow */}
                  <div className="slider">
                    <label>
                      <input
                        type="checkbox"
                        checked={shadowEnabled}
                        onChange={(e) => setShadowEnabled(e.target.checked)}
                      />
                      Shadow
                    </label>
                    {shadowEnabled && (
                      <input type="range" name="shadow" min="0" max="20" value={filters.shadow} onChange={handleFilterChange} className='slide' />
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      )}

      {/* Cropper Confirmation */}
      {showCropper && (
        <div className="cropper-controls">
          <button onClick={handleCrop}>Confirm</button>
          <button onClick={() => setShowCropper(false)}>Cancel</button>
        </div>
      )}
    </section>
  );
};

export default Remove;
