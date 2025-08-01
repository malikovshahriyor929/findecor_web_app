import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0.05,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const chars = containerRef.current.querySelectorAll(".manga-char");

      gsap.fromTo(
        chars,
        { opacity: 0, x: 0 },
        {
          opacity: 1,
          y: 0,
          stagger: delay,
          ease: "power2.out",
          duration: 0.4,
        }
      );
    }
  }, [text, delay]);

  return (
    <div ref={containerRef} className={`inline-block ${className} `}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="manga-char inline whitespace-wrap tracking-wide text-[#1d1d1d] text-sm"
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;
