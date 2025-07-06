"use client";
import { Listbox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const genres = [
  "Trap", "Hip-Hop", "Rap", "Rnb", "Opium","Memphis", "Dark", "Pop", "Rock", "Ambient",
  , "Drill", "Jazz","Funk", "Lo-fi"
];

interface Props {
  onChange: (value: string) => void;
  value: string;
}

const GenreSelect = ({ onChange, value }: Props) => {
  const [selected, setSelected] = useState(value || '');

  const handleChange = (val: string) => {
    setSelected(val);
    onChange(val);
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative">
        <Listbox.Button className="w-full border  text-white rounded-lg px-4 py-2 pr-10 text-left cursor-pointer hover:ring:rose-500 active:rose">
          {selected || 'Select Genre'}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-white" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-lg max-h-60 overflow-auto focus:outline-none">
          {genres.map((genre) => (
            <Listbox.Option
              key={genre}
              value={genre}
              className={({ active, selected }) =>
                `cursor-pointer select-none px-4 py-2 ${
                  active ? 'bg-rose-500 text-white' : 'text-white'
                } ${selected ? 'font-semibold' : ''}`
              }
            >
              {({ selected }) => (
                <span className="flex items-center justify-between">
                  {genre}
                  {selected && <Check className="h-4 w-4 text-white" />}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default GenreSelect;
