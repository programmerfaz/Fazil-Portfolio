import { motion, type HTMLMotionProps, type Transition } from 'framer-motion';

const defaultEase = [0.22, 1, 0.36, 1] as const;

/** Pre-created motion elements (motion.create) for static analysis & lint rules. */
const motionByTag = {
  div: motion.create('div'),
  nav: motion.create('nav'),
  h2: motion.create('h2'),
  span: motion.create('span'),
  section: motion.create('section'),
} as const;

export type FadeInTag = keyof typeof motionByTag;

export type FadeInProps<T extends FadeInTag = 'div'> = Omit<
  HTMLMotionProps<T>,
  'initial' | 'whileInView' | 'transition' | 'viewport'
> & {
  as?: FadeInTag;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  /** Merged after duration, delay, and default ease — override any part of the motion transition. */
  transition?: Transition;
};

export function FadeIn({
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  transition: transitionProp,
  children,
  ...rest
}: FadeInProps) {
  const MotionComponent = motionByTag[as];

  return (
    <MotionComponent
      {...rest}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '80px', amount: 0.12 }}
      transition={{
        ease: defaultEase,
        ...transitionProp,
        duration,
        delay,
      }}
    >
      {children}
    </MotionComponent>
  );
}
