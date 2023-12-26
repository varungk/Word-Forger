import Link from 'next/link';
import React, { useState } from 'react'
import { FiAlignJustify } from "react-icons/fi";
import Logo from './logo';
import { FaRegUserCircle } from "react-icons/fa";
import { useAuth } from '@/config/auth';
import { Avatar } from '@nextui-org/react';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import router from 'next/router';


const Navbar = () => {
    const [menu, setMenu] = useState(false);
    const visibility = () =>{
        setMenu(!menu)
    }
    const settingPage = () =>{
      router.push('/edit')
    }
    const {user,logout} = useAuth()

    const userLogOut = () => {
      logout()
      router.push('/')
    }
  return (
    <>
      <div className='bg-stone-950 p-5 rounded-sm'>
        <div className="container flex-row flex justify-between items-center">
            <div className='flex flex-row'>
                <Logo/>
                <div  className={`lg:flex md:flex hidden flex-row items-center`}>
                    <div className='text-xl text-white mx-3 '><Link href={'/about'}>Use cases</Link></div>
                    <div className='text-xl text-white mx-3 '><Link href={'/contact'}>Resouce</Link></div>
                </div>
            </div>
            {user ? (
              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <div className={`lg:flex md:flex hidden flex-row items-center`}>
                      <div className='pl-2 pt-1'><Avatar src={user.photoURL} className="w-6 h-6 text-tiny"  /></div>
                      <div className='text-white font-bold uppercase pl-2 text-lg'>{user.displayName}</div>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem onClick={settingPage}>Settings</DropdownItem>
                    <DropdownItem className="text-danger" color="danger" onClick={userLogOut}>Logout</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <div className={`lg:flex md:flex hidden`}>
                <button className='bg-stone-950 border border-orange-700 md:text-xl sm:text-sm text-white p-1 rounded-xl px-5'><Link href={'/login'}>Login</Link></button>
              </div>
            )}
            
          {/* lg and md view */}
            <div className='lg:hidden md:hidden visible pr-3'>
                <button onClick={visibility}><FiAlignJustify color='white'/></button>
            </div>
        </div>
      </div>
      {/*Mobile view*/}
      
      {menu &&
        <div className='lg:hidden md:hidden flex flex-col absolute text-right bg-black bg-opacity-75 w-full  items-end top-auto right-0'>
          <div className='py-4'>
            {user && 
              <div className='flex flex-col items-end'>
                <div className='pr-3 pt-1'><Avatar src={user.photoURL} className="w-8 h-8 text-tiny"/></div>
                <div className='text-sm font-bold uppercase pt-1.5 text-white mx-3'>{user.displayName}</div>
              </div>
            }
          </div>
          <div className='py-4 pt-0'>
            <div className='text-sm text-white mx-3 '><Link href={'/'}>Use cases</Link></div>
            <div className='text-sm pt-1.5 text-white mx-3 '><Link href={'/about'}>Resouce</Link></div>
            {user ? (
              <div>
                <div className='text-sm pt-1.5 text-white mx-3'><button onClick={settingPage}>Settings</button></div>
                <div className='text-sm pt-1.5 text-red-700 mx-3'><button onClick={userLogOut}>Logout</button></div>
              </div>
            ) : (
              <div className='text-sm pt-1.5 text-white mx-3 '><Link href={'/login'}>Login</Link></div>
            )}
          </div>
        </div>
      }
    </>

  )
}

export default Navbar