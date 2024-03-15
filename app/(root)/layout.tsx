
import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'

// React.ReactNode is a type for anything that can be rendered in React. It makes the children prop flexible enough to accept any kind of content that can be rendered in React.
const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='root'>
     <Sidebar />
     <MobileNav/>
      <div className="root-container">
        <div className="wrapper">
          {children}
        </div>
      </div>
    </main>
  )
}

export default Layout