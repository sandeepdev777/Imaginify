import React from 'react'

// React.ReactNode is a type for anything that can be rendered in React. It makes the children prop flexible enough to accept any kind of content that can be rendered in React.
// Route groups : grouping of routes inside a common directory.the directory is always enclosed in parentheses().eg. app/(auth)/layout.tsx
// each route group directory has a layout file that is used to wrap the routes inside the group.eg. app/(auth)/layout.tsx
// also it has a page file that is used to define the routes inside the group.eg. app/(auth)/login.tsx
const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='auth'>{children}</main>
  )
}

export default Layout