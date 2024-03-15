"use client"

import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button' // this is the shadcn button in the sidebar


const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} />
        </Link>

        <nav className="sidebar-nav">
        <SignedIn>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link) => {  // this will show the first 6 links in the sidebar
                const isActive = link.route === pathname

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${ 
                    isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'  // change in the color of link in side bar
                  }`}>
                    <Link className="sidebar-link" href={link.route}>   {/* each time when the links in the side bar is clicked it redirect to another page.*/}
                      <Image 
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
              </ul>


            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((link) => {   // this drags the buycredits,profilepage etc to the bottom seperated from other links
                const isActive = link.route === pathname

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${
                    isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                  }`}>
                    <Link className="sidebar-link" href={link.route}>
                      <Image 
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}

              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton afterSignOutUrl='/' showName /> {/**showname,userbutton are predefined components of clerk displays name and gives button to sign out */}
              </li>
            </ul>
          </SignedIn>

{/**Shadcn is a collection of beautifully designed, accessible, and customizable
 *  React components that you can use to build modern web applications with Next. js. */}
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover"> {/**this button component from shadcn */}
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
{/**aschild is name of prop which tells whether  the children of component should be rendered directly or as a DOM element  */}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar