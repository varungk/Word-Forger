import Image from 'next/image'
import { Dancing_Script, Lora } from 'next/font/google'
import AnimatedWord from '@/components/animatedWord'
import UseCaseCards from '@/components/useCaseCards'
import Link from 'next/link'

const lora = Lora({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div className={`bg-[url('../public/bg.jpg')] bg-cover ${lora.className}`}>
        <div className=' lg:p-40 md:p-36 p-28 text-center grid grid-cols-1 items-center justify-center'>
          <p className='text-white text-4xl font-bold'>Word forge is used for<br/>creating</p>
          <AnimatedWord/>
          <p className='text-white pt-8'>Harness the creativity of AI to craft compelling content for blogs, articles, websites, social media, and more.</p>
          <div className='pt-5'>
            <button className='bg-stone-950 border border-orange-700 md:text-xl text-sm text-white p-2 rounded-xl w-52'><Link href={'/signup'}>Start now for free</Link></button>
          </div>
        </div>
      </div>
      <div>
        <p className='lg:text-5xl md:text-5xl text-3xl pt-4 text-black font-bold text-center'>Our products</p>
        <div className=''>

        </div>
        <UseCaseCards/>
      </div>
    </>
  )
}
