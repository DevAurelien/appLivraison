import React from 'react'

export default function CardDocuments({children, titre}) {
  return (
    <div className='w-full card rounded-xl items-center flex flex-col p-4 gap-1 select-none'>
        <h1 className='text-xl pb-2'>{titre}</h1>
        {children}
    </div>
  )
}


