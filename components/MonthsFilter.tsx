import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function MonthFilterBtn({
  text,
  index,
  setPos
}: {
  text: string;
  index: number;
  setPos: (pos: number) => void;
}) {
  return (
    <button
      id={`monthFilterBtn${index}`}
      onClick={() => setPos(index)}
      className="month-filter-btn basis-1/12 -mb-1 py-2 z-10"
    >
      {text}
    </button>
  );
}

export default function MonthsFilter() {
  const [indicatorPosition, setIndicatorPosition] = useState<number>(0);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIndicatorPosition(0);
  }, []);

  useEffect(() => {
    const target = document.querySelector(
      `#monthFilterBtn${indicatorPosition}`
    ) as HTMLButtonElement;
    const indicator = indicatorRef.current;

    indicator!.style.left = `${target.offsetLeft}px`;
    indicator!.style.width = `${target.offsetWidth}px`;
    indicator!.style.height = `${target.offsetHeight}px`;

    if (indicatorPosition === 0) {
      indicator!.style.borderTopLeftRadius = '9999px';
      indicator!.style.borderBottomLeftRadius = '9999px';
      indicator!.style.borderTopRightRadius = '2500px';
      indicator!.style.borderBottomRightRadius = '2500px';
    } else if (indicatorPosition === 11) {
      indicator!.style.borderTopRightRadius = '9999px';
      indicator!.style.borderBottomRightRadius = '9999px';
      indicator!.style.borderTopLeftRadius = '2500px';
      indicator!.style.borderBottomLeftRadius = '2500px';
    } else {
      indicator!.style.borderTopLeftRadius = '9999px';
      indicator!.style.borderBottomLeftRadius = '9999px';
      indicator!.style.borderTopRightRadius = '9999px';
      indicator!.style.borderBottomRightRadius = '9999px';
    }
  }, [indicatorPosition]);

  return (
    <div className="flex flex-row items-center w-full rounded-full p-2 border-[1px] border-[#E2E2E2] text-lg relative">
      <MonthFilterBtn index={0} text="JAN" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={1} text="FEB" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={2} text="MAR" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={3} text="APR" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={4} text="MAY" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={5} text="JUN" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={6} text="JUL" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={7} text="AUG" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={8} text="SEP" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={9} text="OCT" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={10} text="NOV" setPos={setIndicatorPosition} />
      <MonthFilterBtn index={11} text="DEC" setPos={setIndicatorPosition} />
      <span
        ref={indicatorRef}
        className="absolute month-indicator w-[70px] bg-[#E2E2E2] z-0"
      ></span>
    </div>
  );
}
