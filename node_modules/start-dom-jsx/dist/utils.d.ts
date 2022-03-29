import type { JSX, ComponentChild } from './type';
/**
 * 对element 设置style
 * @param element
 * @param style
 */
export declare function setElementStyle(element: JSX.Element, style: Partial<CSSStyleDeclaration>): void;
/**
 * 添加children
 * @param element
 * @param children
 */
export declare function applyChildren(element: JSX.Element, children: ComponentChild[]): void;
export declare function isSvgTag(tag: string): boolean;
