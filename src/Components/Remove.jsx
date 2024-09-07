import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsImageFill, BsImageAlt } from "react-icons/bs";
import { MdDownload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { RxReset } from "react-icons/rx";



const Remove = () => {
  const [image, setImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef(null);
  const [openEffects, setOpenEffects] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    blur: 0,
    hueRotate: 0,
    saturate: 100,
    shadow: 0, // New shadow filter
  });
  const [shadowEnabled, setShadowEnabled] = useState(false); // Shadow toggle state

  // Handle image drop or file select
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
      blur(${filters.blur}px)
      hue-rotate(${filters.hueRotate}deg)
      saturate(${filters.saturate}%)
      ${shadowEnabled ? `drop-shadow(${filters.shadow}px ${filters.shadow}px 10px rgba(0, 0, 0, 0.5))` : ''}
    `;
    return filterString;
  };

  const removeBackground = async () => {
    if (!uploadedFile) {
      console.log("No image file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image_file", uploadedFile);
    formData.append("size", "auto");

    const apiKey = "CXWbUyALBDvPqLEKN2cRzXp7";

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
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
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
      shadow: 0, // Reset shadow
    });
    setShadowEnabled(false); // Reset shadow checkbox
  };

  return (
    <section className="image-editor">
      <div className="ie_title">
        <span>Upload your Image.</span>
      </div>

      {!image && (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <div className="drag_image">
            <BsImageFill className='icon' />
            <p>Drag 'n' drop an image here, or click to select one</p>
          </div>
        </div>
      )}

      {image && <div className="edit_cont">
        {image && (
          <div className="image-container" style={{ backgroundColor: bgColor }}>
            <img src={image} alt="Uploaded" style={{ filter: applyFilters() }} />
          </div>
        )}

        <div className="edit_options">
          {uploadedFile && (
            <div className="filter-buttons">
              <button onClick={removeBackground}><BsImageAlt /></button>
              <span>Remove Background</span>
            </div>
          )}

          {image && (
            <>
              <div className="background-color-picker">
                <input
                  type="color"
                  id="bg-color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <label htmlFor="bg-color">Choose Background Color:</label>
              </div>

              <div className="download-button">
                <button onClick={() => setOpenEffects(true)}>fx</button>
                <label>Effects</label>
              </div>

              <div className="reset-button">
                <button onClick={resetFilters}><RxReset /></button>
                <label>Reset</label>
              </div>
              <div className="download-button">
                <button onClick={downloadImage}><MdDownload /></button>
                <label>Download Image</label>
              </div>

            </>
          )}

          {/* Effects Dialog Box */}
          {openEffects && (
            <div className="effects-dialog">
              <div className="slider-container">
                <div className="slider">
                  <label>Brightness</label>
                  <input type="range" name="brightness" min="0" max="200" value={filters.brightness} onChange={handleFilterChange} className='slide' />
                </div>
                <div className="slider">
                  <label>Contrast</label>
                  <input type="range" name="contrast" min="0" max="200" value={filters.contrast} onChange={handleFilterChange}  className='slide'/>
                </div>
                <div className="slider">
                  <label>Grayscale</label>
                  <input type="range" name="grayscale" min="0" max="100" value={filters.grayscale} onChange={handleFilterChange}  className='slide'/>
                </div>
                <div className="slider">
                  <label>Saturation</label>
                  <input type="range" name="saturate" min="0" max="200" value={filters.saturate} onChange={handleFilterChange}  className='slide'/>
                </div>

                {/* Shadow Filter Toggle */}
                <div className="slider2">
                    <input type="checkbox" checked={shadowEnabled} onChange={() => setShadowEnabled(!shadowEnabled)} className='check'/>
                    <label>shadow</label>
                </div>

                {/* Shadow slider, visible only if shadow is enabled */}
                {shadowEnabled && (
                  <div className="slider">
                    <input type="range" name="shadow" min="0" max="20" value={filters.shadow} onChange={handleFilterChange}  className='slide'/>
                  </div>
                )}
              </div>
              <button onClick={() => setOpenEffects(false)} className='close'><IoMdClose /></button>
            </div>
          )}
        </div>
      </div>}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </section>
  );
};

export default Remove;
