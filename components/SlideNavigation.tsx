"use client";

interface Props {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

function NavButton({
  onClick,
  disabled,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  direction: "prev" | "next";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-white/70 p-3 rounded-full disabled:opacity-20 disabled:cursor-not-allowed hover:text-white hover:bg-white/10 transition-all"
      aria-label={direction === "prev" ? "Slide anterior" : "Próximo slide"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "prev" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"}
        />
      </svg>
    </button>
  );
}

function ProgressDots({
  currentSlide,
  totalSlides,
  onGoTo,
}: {
  currentSlide: number;
  totalSlides: number;
  onGoTo: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onGoTo(index)}
          className={`rounded-full transition-all duration-300 ${
            index === currentSlide
              ? "bg-white w-8 h-2"
              : "bg-white/30 w-2 h-2 hover:bg-white/50"
          }`}
          aria-label={`Slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onGoTo,
}: Props) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full z-50">
      <NavButton onClick={onPrev} disabled={currentSlide === 0} direction="prev" />
      
      <ProgressDots currentSlide={currentSlide} totalSlides={totalSlides} onGoTo={onGoTo} />
      
      <NavButton onClick={onNext} disabled={currentSlide === totalSlides - 1} direction="next" />
    </div>
  );
}
