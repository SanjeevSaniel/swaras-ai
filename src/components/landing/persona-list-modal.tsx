'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getEnabledPersonas } from '@/constants/personas';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Sparkles, Search, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SetStateAction, useState } from 'react';
import { Input } from '@/components/ui/input';

export const PersonaListModal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const allPersonas = Object.entries(getEnabledPersonas())
    .map(([id, persona]: [string, any]) => ({ ...persona, id }))
    .filter((p) => p.enabled);

  const filteredPersonas = allPersonas.filter(
    (p: any) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='default'
          className='group rounded-full px-6 border-gray-200 hover:border-gray-300 hover:bg-white/30 transition-all duration-300 bg-white/30 dark:bg-white/30 shadow-sm'>
          <span className='mr-2 text-gray-700'>Explore all personas</span>
          <ArrowRight className='w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-[#FA8072]' />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='w-full h-[100dvh] sm:h-[80vh] sm:max-w-2xl flex flex-col p-0 overflow-hidden gap-0 bg-white border-none shadow-2xl sm:rounded-2xl rounded-none'>
        <DialogHeader className='px-4 sm:px-6 py-4 sm:py-5 bg-white/80 backdrop-blur-md z-10 sticky top-0'>
          <div className='flex items-center justify-between mb-4'>
            <DialogTitle className='flex items-center gap-2 text-xl font-light text-gray-900'>
              <div className='p-1.5 rounded-lg bg-orange-50'>
                <Sparkles className='w-4 h-4 text-[#FA8072]' />
              </div>
              Meet the Mentors
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500'>
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
              </Button>
            </DialogClose>
          </div>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              type='text'
              placeholder='Search by name or expertise...'
              className='pl-9 bg-white/50 dark:bg-white/50 border-none text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-50 transition-all rounded-xl'
              value={searchQuery}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        </DialogHeader>

        <ScrollArea className='flex-1 bg-white h-full min-h-0'>
          <div className='p-4 flex flex-col gap-1'>
            <AnimatePresence mode='popLayout'>
              {filteredPersonas.map((persona: any, index) => (
                <motion.div
                  key={persona.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className='flex items-center gap-3 sm:gap-4 group cursor-default py-1'>
                  {/* Styled Number - Responsive */}
                  <div className='w-8 sm:w-12 text-right font-mono text-lg sm:text-2xl font-bold text-gray-100 group-hover:text-[#FA8072] transition-colors duration-300 select-none'>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Card Content - Borderless */}
                  <div className='flex-1 flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl bg-transparent hover:bg-gray-50 transition-all duration-200'>
                    <div className='relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform'>
                      <Image
                        src={persona.avatarUrl}
                        alt={persona.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-0.5'>
                        <h3 className='font-medium text-gray-900 truncate text-sm sm:text-base'>
                          {persona.name}
                        </h3>
                        {persona.category && (
                          <span className='hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 uppercase tracking-wide'>
                            {persona.category}
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-[#FA8072] font-medium mb-0.5 truncate'>
                        {persona.title}
                      </p>
                      <p className='text-xs text-gray-400 leading-relaxed line-clamp-1'>
                        {persona.description}
                      </p>
                    </div>
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200'>
                      <ArrowRight className='w-4 h-4 text-gray-300' />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPersonas.length === 0 && (
              <div className='py-12 text-center text-gray-400 text-sm'>
                No personas found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </ScrollArea>

        <div className='p-4 border-t border-gray-100 bg-gray-50/50 text-center'>
          <p className='text-xs text-gray-400'>
            {allPersonas.length} specialized AI mentors available 24/7
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
