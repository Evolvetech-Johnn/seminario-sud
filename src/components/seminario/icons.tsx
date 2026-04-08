import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
};

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconLamb(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M7.5 12.2c0-2.3 1.9-4.2 4.2-4.2 2.4 0 4.3 1.9 4.3 4.2v1.3c0 2.9-2.4 5.3-5.3 5.3h-.5c-1.5 0-2.7-1.2-2.7-2.7v-1.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 7.7c-.4-1.3.5-2.7 1.9-2.9 1.1-.2 2.1.4 2.5 1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.6 10.2c1.4-.2 2.4-1.4 2.2-2.8-.2-1.4-1.5-2.4-2.9-2.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 3.5 19 6.6v6.2c0 4.2-3 7.9-7 8.7-4-.8-7-4.5-7-8.7V6.6L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.3 11 14.2l3.8-4.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconRepeat(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M7 7h9a3 3 0 0 1 3 3v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 17H8a3 3 0 0 1-3-3v-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 7 5 9m2-2 2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17 19 15m-2 2-2-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBread(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M6.5 10.5c0-3 2.4-5.5 5.5-5.5s5.5 2.5 5.5 5.5v8.5H6.5v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 8.3c.2.6.8 1 1.4 1M13.3 9.3c.6 0 1.2-.4 1.4-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconWater(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 3.5c3.3 4.3 5 7.2 5 9.8a5 5 0 0 1-10 0c0-2.6 1.7-5.5 5-9.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 15.1c.6.8 1.5 1.3 2.4 1.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconCovenant(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M7 8.2c.8-.8 2-1.3 3.2-1.3h6.8v11.6H10.2c-1.2 0-2.4.5-3.2 1.3V8.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 8.2V19.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.2 10.2h4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

