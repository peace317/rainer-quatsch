/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';

/**
 * Checks, if the current process takes places server side. Can be used as well to check, if the process is in the browser.
 * @returns true, if server side. False, if client side.
 */
export const isServer = (): boolean => {
    return typeof window === 'undefined';
};

const BASE_URLS: Record<'archive' | 'conversation' | 'schedule' | 'messages' | 'message-seen' | 'register' | 'call', string> = {
    archive: process.env.NEXT_PUBLIC_API_ARCHIVE || '/api/archive/[archiveId]',
    conversation: process.env.NEXT_PUBLIC_API_CONVERSATION || '/api/conversation/[conversationId]',
    'message-seen': process.env.NEXT_PUBLIC_API_MESSAGE_SEEN || '/api/conversation/[conversationId]/seen/',
    schedule: process.env.NEXT_PUBLIC_API_SCHEDULE || '/api/schedule/[scheduleId]',
    // messages will not be processed with a message id, but with the corresponding conversation id
    messages: process.env.NEXT_PUBLIC_API_MESSAGES || '/api/messages/[conversationId]',
    register: process.env.NEXT_PUBLIC_API_REGISTER || '/api/register/',
    call: process.env.NEXT_PUBLIC_API_CALL || '/api/call/[callId]'
};

/**
 * Constructs the api url from the given base url key. Any url parameter will be inserted according to
 * the definition of the url. Any id's at the end of an url are optional, so the url can be used
 * for creation, if no parameter is given, or for querying, if there was a parameter provided.
 *
 * @param key of the api url
 * @param params dynamic parameters that shall be inserted
 * @returns constructed url to be used for fetch calls
 */
export const apiUrl = (key: keyof typeof BASE_URLS, ...params: (string | number)[]): string => {
    let url = BASE_URLS[key];

    const placeholders = url.match(/\[\w+\]/g) || [];

    placeholders.forEach((placeholder, index) => {
        let _placeholder = placeholder;
        // if there is one parameter less, we expect that the api is used as non dynamic and replace it with an empty string
        if (params.length === index && params.length === placeholders.length - 1) {
            _placeholder = '';
        }

        const paramValue = params[index] || _placeholder;
        url = url.replace(placeholder, String(paramValue));
    });

    return url;
};

interface Props {
    [key: string]: any;
}

// taken from: https://stackoverflow.com/questions/51603250/typescript-3-parameter-list-intersection-type/51604379#51604379
type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V } ? V : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export function isProp<U extends HTMLElement, T extends React.HTMLAttributes<U>>(prop: T | undefined): prop is T {
    return prop !== undefined;
}

export function mergeProps<U extends HTMLElement, T extends Array<React.HTMLAttributes<U> | undefined>>(...props: T) {
    return mergePropsReactAria(...props.filter(isProp));
}

/**
 * Merges multiple props objects together. Event handlers are chained,
 * classNames are combined, and ids are deduplicated - different ids
 * will trigger a side-effect and re-render components hooked up with `useId`.
 * For all other props, the last prop object overrides all previous ones.
 * @param args - Multiple sets of props to merge together.
 * @internal
 */
export function mergePropsReactAria<T extends Props[]>(...args: T): UnionToIntersection<TupleTypes<T>> {
    // Start with a base clone of the first argument. This is a lot faster than starting
    // with an empty object and adding properties as we go.
    const result: Props = { ...args[0] };
    for (let i = 1; i < args.length; i++) {
        const props = args[i];
        for (const key in props) {
            const a = result[key];
            const b = props[key];

            // Chain events
            if (
                typeof a === 'function' &&
                typeof b === 'function' &&
                // This is a lot faster than a regex.
                key[0] === 'o' &&
                key[1] === 'n' &&
                key.charCodeAt(2) >= /* 'A' */ 65 &&
                key.charCodeAt(2) <= /* 'Z' */ 90
            ) {
                result[key] = chain(a, b);

                // Merge classnames, sometimes classNames are empty string which eval to false, so we just need to do a type check
            } else if ((key === 'className' || key === 'UNSAFE_className') && typeof a === 'string' && typeof b === 'string') {
                result[key] = clsx(a, b);
            } else {
                result[key] = b !== undefined ? b : a;
            }
        }
    }

    return result as UnionToIntersection<TupleTypes<T>>;
}

/**
 * Calls all functions in the order they were chained with the same arguments.
 * @internal
 */
export function chain(...callbacks: any[]): (...args: any[]) => void {
    return (...args: any[]) => {
        for (const callback of callbacks) {
            if (typeof callback === 'function') {
                try {
                    callback(...args);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };
}
