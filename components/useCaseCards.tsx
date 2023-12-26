import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import {Card, CardHeader, CardBody} from "@nextui-org/react";
import img from '../public/email.jpg'
import { useAuth } from '@/config/auth';
import router from 'next/router';
import Link from 'next/link'

const UseCaseCards = () => {

  const {getUseCaseData} = useAuth()
  const [data,setData] = useState<any>()
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    console.log("Inside useCase")
    getUseCaseData().then((e:any) => {
      setData(e)
      setLoading(true)
    }).catch((error:any) => {
      console.error('Error fetching use case data:', error);
    });
  }, [getUseCaseData]);
  if(loading){
    return (
      <>
          <div className='p-10 lg:pl-24 md:pl-16 pl-16 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 justify-center'>
          {data.map((value:any) =>
            <Card key={value.id} className="py-4 w-72 hover:scale-110">
              <Link href={value.path}>
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={value.imgUrl}
                  width={270}
                  height={270}
                />
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <p className="font-bold text-xl text-center">{value.title}</p>
                <p className="text-default-500">{value.desc}</p>
              </CardBody>
              </Link>
            </Card>
          )}
          </div>
      </>
    )
  }
  else{
    return (
      <div className='p-6'>
        <div>Oops!</div>
        <div>We are facing an issue currently. Please try again later</div>
      </div>
    )
  }
}

export default UseCaseCards