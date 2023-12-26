import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <div>
        <div className='text-2xl font-bold text-transparent bg-clip-text mx-3 bg-gradient-to-r from-orange-200 to-orange-800'><Link href={'/'}>Word Forger</Link></div>
    </div>
  )
}

export default Logo