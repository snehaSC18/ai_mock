import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Header() {
  return (
    <div className='flex p-4'>
        <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
        <ul className='flex gap-6 items-center justify-between bg-secondary shadow-sm'>
            <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>Dashboard</li>
            <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>Questions</li>
            <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>Upgrade</li>
            <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>How it works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header