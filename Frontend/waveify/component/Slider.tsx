"use client"

import * as RadixSlider from "@radix-ui/react-slider"

interface SlideProps {
  value?: number
  onChange?: (value: number) => void
}

const Slider: React.FC<SlideProps> = ({ value = 1, onChange }) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0])
  }

  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-2 group cursor-pointer"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.001}
      aria-label="Volume">
      <RadixSlider.Track
        className="
          bg-neutral-600 relative grow rounded-full h-[3px]
        ">
        <RadixSlider.Range
          className="
           absolute rounded-full h-full transition-colors bg-[var(--lightRose)] group-hover:bg-rose-500
          "
        />
       
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block w-3 h-3 rounded-full bg-[var(--lightRose)] border border-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </RadixSlider.Root>
  )
}

export default Slider
