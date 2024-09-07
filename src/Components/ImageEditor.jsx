import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    invert: 0,
    grayscale: 0,
    hue: 0,
  });
  const imgRef = useRef(null);
  const inputFileRef = useRef(null); // Reference for the file input
  const [cropper, setCropper] = useState(null);
  const [shouldInitializeCropper, setShouldInitializeCropper] = useState(false);

  // Handle image drop or file select
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set image
        setShouldInitializeCropper(true); // Trigger cropper initialization
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });



  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Remove background using remove.bg API
  const removeBackground = async () => {
    const file = inputFileRef.current.files[0]; // Get the file from the file input
    if (!file) {
      console.log("No image file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    const apiKey = "CXWbUyALBDvPqLEKN2cRzXp7"; // Replace with your API key

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to remove background: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImage(url); // Set the new image with the background removed
      setShouldInitializeCropper(true); // Trigger cropper initialization

      if (cropper) {
        cropper.destroy(); // Destroy cropper when new image is loaded
      }
    } catch (err) {
      console.error("Error removing background:", err);
    }
  };

  // Save the cropped image
  const handleCrop = () => {
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL();
      setImage(croppedImage); // Update the image with the cropped version
      cropper.destroy(); // Destroy cropper after cropping
      setCropper(null); // Clear the cropper state
    }
  };

  // Combine all filters into one CSS filter string
  const filterStyles = {
    filter: `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      blur(${filters.blur}px) 
      invert(${filters.invert}%) 
      grayscale(${filters.grayscale}%) 
      hue-rotate(${filters.hue}deg)
    `,
    backgroundColor: bgColor,
  };

  return (
    <section className="image-editor">
      <div className="ie_title">
        <span>Upload your Image and see magic.</span>
      </div>
      {/* Drag and drop area */}
      {!image && (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} ref={inputFileRef} />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <p>Drag 'n' drop an image here, or click to select one</p>
          )}
        </div>
      )}

      {/* Display uploaded image with Cropper.js */}
      {image && (
        <div className="image-container">
          <img ref={imgRef} src={image} alt="Uploaded" style={filterStyles} />
        </div>
      )}

      {/* Filter Sliders */}
      <div className="filter-sliders">
        <div className="slider">
          <span>Brightness</span>
          <input
            type="range"
            name="brightness"
            min="0"
            max="200"
            value={filters.brightness}
            onChange={handleFilterChange}
          />
        </div>
        <div className="slider">
          <span>Contrast</span>
          <input
            type="range"
            name="contrast"
            min="0"
            max="200"
            value={filters.contrast}
            onChange={handleFilterChange}
          />
        </div>
        <div className="slider">
          <span>Saturation</span>
          <input
            type="range"
            name="saturation"
            min="0"
            max="200"
            value={filters.saturation}
            onChange={handleFilterChange}
          />
        </div>
        <div className="slider">
          <span>Blur</span>
          <input
            type="range"
            name="blur"
            min="0"
            max="20"
            value={filters.blur}
            onChange={handleFilterChange}
          />
        </div>
        <div className="slider">
          <span>Invert</span>
          <input
            type="range"
            name="invert"
            min="0"
            max="100"
            value={filters.invert}
            onChange={handleFilterChange}
          />
        </div>
        <div className="slider">
          <span>Grayscale</span>
          <input
            type="range"
            name="grayscale"
            min="0"
            max="100"
            value={filters.grayscale}
            onChange={handleFilterChange}
          />
        </div>
        <div className="slider">
          <span>Hue</span>
          <input
            type="range"
            name="hue"
            min="0"
            max="360"
            value={filters.hue}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Color Picker for Background */}
      <div className="color-picker">
        <label>Background Color: </label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={removeBackground}>Remove Background</button>
        <button onClick={handleCrop}>Crop Image</button>
        <button
          onClick={() => setFilters({
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            invert: 0,
            grayscale: 0,
            hue: 0,
          })}
        >
          Reset Filters
        </button>
      </div>
    </section>
  );
};

export default ImageEditor;
