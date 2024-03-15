"use client"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import Link from "next/link"
  import Image from "next/image"
import { UserButton ,SignedIn,SignedOut } from "@clerk/nextjs"
import { navLinks } from "@/constants"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const MobileNav = () => {
    const pathname = usePathname();

  return (
    <header className="header">
        <Link href="/" className="flex items-center gap-2 md:py-2" >{/** md is the prefix which set the breakpoint of 768 px. means the css will only be applied for  upto 768px  */}
          <Image 
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}/>
        </Link>

       <nav className="flex gap-2">
        <SignedIn>
            <UserButton afterSignOutUrl="/"/>


        {/**sheet component directly copied from shadcn website and modified . you can have several other components 
         * like sheets at shadcn website which
         * you can use in your project.
        */}
                <Sheet>
        <SheetTrigger> {/** adding the menu image to the sheet on which we click to open sheet*/}
            <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={32}
            height={32}
            className="cursor-pointer"/>
        </SheetTrigger>

        <SheetContent className="sheet-content sm:w-64"> {/**setting the size of sheet for smaller device. sm is another breakpoint. */}
           <>
           <Image  // imaginify logo for sheet
           src="/assets/images/logo-text.svg"
           alt="logo"
           width={152}
           height={23}
           />
           
           <ul className="header-nav_elements"> 
              {navLinks.map((link) => {  // mapping the links so that you can click on them and go to the respective page
                const isActive = link.route === pathname

                return (
                    <li 
                    className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}
                    key={link.route}
                    >
                    <Link className="sidebar-link cursor-pointer" href={link.route}>
                      <Image   // icons for each link
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
              </ul>
           </>
        </SheetContent>
        </Sheet>
        </SignedIn>

        <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
       </nav>
    </header>
  )
}

export default MobileNav