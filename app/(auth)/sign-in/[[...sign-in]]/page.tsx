import React from 'react'
import { SignIn } from '@clerk/nextjs'

// Clerk is predefined user management and authentication system which can be inrtegrated with the application
// it can be used to create user, login, logout, reset password, etc
//mainly it is used with nextjs and react application.
// for proper integration and installation you can refer to their official documentation.
const SignInPage = () => {
  return <SignIn/>
}

export default SignInPage