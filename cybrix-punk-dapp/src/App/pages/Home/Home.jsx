import React from 'react'

export default function Home() {
  return (
    <header>
        <div className="container-fluid">
            <div className='row align-items-center pt-6 pb-4 mt-4 mt-lg-0'>
                <div className='col-xl-2 col-md-3 mb-4 mb-md-0 col-12 text-center text-md-start'>
                    <div className='navbar-brand' style={{
                        fontFamily: 'Inter',
                        fontSize: '1.8rem',
                        "color": "var(--fc-primary)",
                        "fontWeight": "bold"
                    }}>Cybrix Punks</div>
                </div>
                <hr />
            </div>
        </div>
    </header>
  )
}
