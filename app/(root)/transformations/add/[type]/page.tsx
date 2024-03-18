
 import Header from '@/components/shared/Header'
 import { transformationTypes } from '@/constants'
 import  TransformationForm from '@/components/shared/TransformationForm'
import {auth} from '@clerk/nextjs'
import { getUserById } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation';

 // this grabs the info from url and displays the title and subtitle of the transformation type
const AddTransformationTypePage = async ({params:{type}}:SearchParamProps) => {
  const {userId} =auth();  // fetching the user id from clerk
  if(!userId) redirect('/sign-in')
  const user =await getUserById(userId);  // matching the user id taken from clerk with the user id in the database and then fetch all the details of the user from the database

  const transformation=transformationTypes[type];
  
  return (
  <>
     <Header
          title={transformation.title}
          subtitle={transformation.subTitle}
       />

 <section className="mt-10">
      <TransformationForm 
              action="Add"
              userId={user._id}
              type={transformation.type as TransformationTypeKey}
              creditBalance={user.creditBalance}
            />
 </section>
   </>
  )
}

export default AddTransformationTypePage