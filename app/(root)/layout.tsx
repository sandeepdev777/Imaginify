
import React from 'react';
import MobileNav from '@/components/shared/MobileNav';
import Sidebar from '@/components/shared/Sidebar';


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <Sidebar />
      <MobileNav />

      <div className="root-container">
        <div className="wrapper">
          <React.Fragment> // Wrap children prop inside a React fragment
            {children}
          </React.Fragment>
        </div>
      </div>
    </main>
  );
}

export default Layout