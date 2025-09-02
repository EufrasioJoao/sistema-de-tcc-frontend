'use client';
import { PulseLoader } from "react-spinners";


export function Loading(){

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center text-primary">
      <PulseLoader size={8} />
    </div>
  )
}
