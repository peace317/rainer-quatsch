/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Atom Variant of the truncate markup. Atoms serve as a way to let <TruncateMarkup /> know 
 * that the content they contain is not splittable - it either renders in full or does not 
 * render at all.
 * @author https://github.com/patrik-piskay/react-truncate-markup
 * @param props
 * @returns
 */
export const Atom = (props: any) => {
    return props.children || null;
};
Atom.__rtm_atom = true;

export const isAtomComponent = (reactEl: any) => {
    return !!(reactEl && reactEl.type && reactEl.type.__rtm_atom === true);
};

export const ATOM_STRING_ID = '<Atom>';
