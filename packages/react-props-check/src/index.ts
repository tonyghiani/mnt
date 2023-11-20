import { ReactAcceptedProp, reactAcceptedPropertiesSet } from './react_props';

export type { ReactAcceptedProp } from './react_props';
export type DataAttribute = `data-${string}`;

function isValidProp(property: ReactAcceptedProp | DataAttribute) {
  return reactAcceptedPropertiesSet.has(property) || isDataAttribute(property);
}

export default isValidProp;

/**********************/

function isDataAttribute(property: string) {
  return property.startsWith('data-');
}
