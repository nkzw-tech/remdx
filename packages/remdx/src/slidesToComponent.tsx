import { MDXProvider } from '@mdx-js/react';
import { ReMDXModule } from '../types.tsx';
import DefaultComponents from './components/Components.tsx';
import Deck from './deck.tsx';
import Slide from './slide.tsx';
import { Transitions as DefaultTransitions } from './transitions.tsx';

export default async function slidesToComponent(module: Promise<ReMDXModule>) {
  const { Components, Themes, Transitions, default: slides } = await module;
  return (
    <MDXProvider components={{ ...DefaultComponents, ...Components }}>
      <Deck
        slides={slides.map(({ Component, data }, index) => (
          <Slide
            id={index}
            image={data?.image}
            key={index}
            style={Themes?.[data?.theme] || Themes?.default}
            transition={
              Transitions?.[data?.transition] ||
              DefaultTransitions[data?.transition] ||
              undefined
            }
          >
            <Component />
          </Slide>
        ))}
      />
    </MDXProvider>
  );
}
