"use client"

import Image from 'next/image';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function CountChart({boys, girls, other}: {boys: number; girls: number; other: number}) {
  
  const data = [
    {
      name: 'Total',
      count: boys + girls + other,
      fill: 'white',
    },  {
      name: 'Girls',
      count: girls,
      fill: '#fae27c',
    },
    {
      name: 'Boys',
      count: boys,
      fill: '#c3ebfa',
    },
  ];

  return (
    <div className="w-full h-[75%] relative">
      <ResponsiveContainer>
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={20} data={data}>
          <RadialBar              
            background              
            dataKey="count"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image src='/malefemale.png' alt='' width={50} height={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
    </div>
  )
}