// type JSONPrimitive = string | number | boolean | null | undefined;
// export type JSONValue = JSONPrimitive | JSONValue[] | {
//     [key: string]: JSONValue;
// };

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX;

export type ScreenPos = { x: number, y: number };

export enum MouseAction {
    CLICK,
    DBLCLICK,
    DRAG
};

export type Range = { begin: number, end: number };
export type Rect = {x: number, y: number, w: number, h: number };