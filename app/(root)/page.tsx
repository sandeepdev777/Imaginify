//modified
import { navLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || '';

  return (
    <>
      
    </>
  )
}

export default Home