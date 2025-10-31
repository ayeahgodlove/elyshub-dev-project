import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const AvatarComponent = () => {
    return (
        <>
            <Avatar className="w-10 h-10">
                <AvatarImage
                    className='object-cover'
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Alison Eyo" />
                <AvatarFallback className="bg-slate-600 text-white">
                    AE
                </AvatarFallback>
            </Avatar>
        </>
    )
}
