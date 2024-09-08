import React from 'react'

const Banner = () => {
  return (
    <>
     <section className='banner'>
        <div className="b_title">
        <span>You can Remove Image Background.</span>
        <span>Just in one click</span>
        </div>
        <div className="b_image">
            <div className="image"><img src="images/banner.jpg" alt="" /></div>
            <div className="image2"><img src="images/banner2.png" alt="" /></div>
        </div>
     </section> 
    </>
  )
}

export default Banner
