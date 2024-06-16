export type Param<T extends string | number | symbol> = {
    [key in T]: string;
};

export type Props<T extends string = string> = {
    params?: Param<T>;
};

/**
 * Absolut geiler scheiß!
 * Wenn man ein Typ überschreiben möchte, der ein verpfilchtendes Feld hat, kann man damit
 * das Feld Optional machen.
 *
 * Bsp.:
 * @example
 * interface GroupChatModalProps extends Optional<DialogProps, 'onHide'> {
 *   callback?: (conversation: ConversationType) => void;
 * }
 * @example
 * interface GroupChatModalProps extends Optional<DialogProps, 'onHide' | 'maximizeIcon'> {
 *   callback?: (conversation: ConversationType) => void;
 * }
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;