'use client';

import { personas } from '@/constants/personas-dataset';
import { MoreHorizontal, Phone, Star, Video } from 'lucide-react';
import Image from 'next/image';

const NixtioChatHeader = ({ selectedPersona }) => {
  const persona = selectedPersona ? personas[selectedPersona] : null;

  if (!persona) {
    return (
      <div className='h-[72px] bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl shadow-lg'>
            💬
          </div>
          <div>
            <h2 className='text-base font-bold text-gray-900'>Select a Mentor</h2>
            <p className='text-xs text-gray-500'>Choose a mentor to start chatting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-[72px] bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 flex items-center justify-between'>
      {/* Persona Info */}
      <div className='flex items-center gap-3'>
        {/* Persona Avatar */}
        {persona.avatarUrl ? (
          <div className='relative w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white'>
            <Image
              src={persona.avatarUrl}
              alt={persona.name}
              fill
              className='object-cover'
            />
          </div>
        ) : (
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#FA8072] to-[#FF8E8E] flex items-center justify-center text-2xl shadow-lg'>
            {persona.avatar}
          </div>
        )}

        {/* Persona Name and Status */}
        <div>
          <h2 className='text-base font-bold text-gray-900'>{persona.name}</h2>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-green-500' />
            <span className='text-xs text-green-600 font-medium'>{persona.title}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center gap-2'>
        <button className='p-2.5 rounded-xl hover:bg-gray-100 transition-colors'>
          <Star className='w-5 h-5 text-gray-600' />
        </button>
        <button className='p-2.5 rounded-xl hover:bg-gray-100 transition-colors'>
          <Video className='w-5 h-5 text-gray-600' />
        </button>
        <button className='p-2.5 rounded-xl hover:bg-gray-100 transition-colors'>
          <Phone className='w-5 h-5 text-gray-600' />
        </button>
        <button className='p-2.5 rounded-xl hover:bg-gray-100 transition-colors'>
          <MoreHorizontal className='w-5 h-5 text-gray-600' />
        </button>
      </div>
    </div>
  );
};

export default NixtioChatHeader;
