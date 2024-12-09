import React from 'react'

const TestInterpretation = ({ interpretation }: { interpretation: string }) => {
  return (
    <div className="bg-gray-200 px-4 print:bg-white interpretation-section">
      <div className="text-md font-medium mb-2">Interpretations:</div>
      <div 
        className="w-[97%] text-sm [&_table]:border-[1px] [&_table]:border-dashed [&_table]:border-black
          [&_table]:border-collapse [&_table]:w-full
          [&_td]:border-[1px] [&_td]:border-dashed [&_td]:border-black [&_td]:py-2 [&_td]:px-2
          [&_th]:border-[1px] [&_th]:border-dashed [&_th]:border-black [&_th]:py-2 [&_th]:px-2"
        dangerouslySetInnerHTML={{ __html: interpretation || '' }}
      />
    </div>
  );
};

export default TestInterpretation;
