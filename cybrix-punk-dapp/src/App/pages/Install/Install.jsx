import React from 'react'

export default function Install() {
  return (
    <div className='container d-flex flex-column'>
        <div className='row min-vh-100 justify-content-center align-items-center'>
            <div className='offset-lg-1 col-lg-10  py-8 py-xl-0'>
                <div className='mb-10 mb-xxl-0'>
                    <span style={{"fontFamily": "Inter", "fontSize": "3rem", "color": "var(--fc-primary)", "fontWeight": "bold"}}>Cybrix Punks</span>
                </div>
                <div class="row justify-content-center align-items-center">
                    <div class="col-md-6">
                        <div class=" mb-6 mb-lg-0">
                            <h1>Something's wrong here...</h1>
                            <p class="mb-8">We can't find the a crypto wallet on your browser.<br />
                            <a href="https://metamask.io/download.html">Meta Mask</a></p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div>
                            <img src="https://freshcart.codescandy.com/assets/images/svg-graphics/error.svg" alt="" class="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
