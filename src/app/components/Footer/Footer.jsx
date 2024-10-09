import Link from 'next/link'
import React, { Fragment } from 'react'

function Footer() {
  return (
    <Fragment>
        <div className='pt-10 w-[90%] mx-auto'>
            <img src="./assets/footerBox.png"  alt="" />
            <div className='xl:flex  py-7'>
            <div className='flex items-start gap-2 w-[30%]'>
                <img src="./assets/footerLines.svg" className='h-[80px] w-[80px]' alt="" />
                <p className='spaceGrotesk lg:text-[80px] text-[50px]'>Voor.IT</p>
            </div>
            <div className='Azeret text-[12px] flex justify-evenly flex-wrap xl:w-[70%] lg:gap-y-0 gap-y-8 mt-6'>
                <div className='w-auto'>
                    <p className=' text-orange-700 pb-5'>Menu</p>
                    <Link href='' className='block '>Upgrade</Link>
                    <Link href='' className='block py-2'>Terms & Conditions</Link>
                    <Link href='' className='block '>Blog</Link>

                </div>
                <div className='w-auto'>
                    <p className=' text-orange-700 pb-5'>Legal</p>
                    <Link href='' className='block py-2'>Terms & Conditions</Link>
                    <Link href='' className='block '>Refund Policy</Link>
                    <Link href='' className='block '>Privacy Policy</Link>
                    <Link href='' className='block '>Accessibility Statement</Link>

                </div>
                <div className='w-auto'>
                    <p className=' text-orange-700 pb-5'>Social</p>
                    <Link href='' className='block py-2'>Twitter</Link>
                    <Link href='' className='block '>Facebook</Link>
                    <Link href='' className='block '>LinkedIn</Link>

                </div>
                <div className='w-auto'>
                    <p className=' text-orange-700 pb-5'>Contact</p>
                    <Link href='' className='block py-2'>info@mysite.com
                    </Link>
                    <p className='block '>123-456-7890
                    </p>
                    <p className='block '>500 Terry Francine Street,
                    </p>
                    <p className='block '>San Francisco, CA 94158</p>

                </div>
            </div>
            </div>
        </div>
            <div className='bg-orange-700 py-2 text-white'>
                <p className='Azeret text-[12px] w-[90%] mx-auto'>© 2035 by Voor.IT. Made with <Link href='' className='underline'>Wix Studio™</Link></p>
            </div>
      
    </Fragment>
  )
}

export default Footer
