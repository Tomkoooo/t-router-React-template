import React, { useEffect } from 'react'
import { Link } from '@tomkoooo/t-router'
import axios from 'axios'

const page = () => {

  useEffect(() => {
    axios.get('/api/4').then((res: { data: any }) => {
      console.log(res.data.message)
    })
  }, [])

  return (
    <div>
      <h1>Welcome to your new page! Create new pages by adding files to the `src/pages/[pagename]/page.tsx` directory.</h1>
      <a href='https://www.npmjs.com/package/@tomkoooo/t-router?activeTab=readme' target='_blank'>For docs read this.</a>
      <p className='text-gray-500/30'>Tailwind, pages router, api router with Vite is up to date.</p>
    </div>
  )
}

export default page