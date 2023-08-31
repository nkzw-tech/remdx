import { MDXProvider } from '@mdx-js/react';
import { ReMDXModule } from '../types';
import DefaultComponents from './components';
import Deck from './deck';
import Slide from './slide';
import { Transitions as DefaultTransitions } from './transitions';

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
