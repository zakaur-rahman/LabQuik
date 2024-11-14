import React from 'react'
import "./Loader.css"

type Props = {}

const Loader = (props: Props) => {
    return (
        <section className='flex justify-center items-center h-screen'>
            <div className="loader"></div>
        </section>
    )
}

export default Loader

 