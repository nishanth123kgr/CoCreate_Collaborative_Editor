import { DOMOutputSpec, Mark as ProseMirrorMark, MarkSpec, MarkType } from '@tiptap/pm/model';
import { Plugin, Transaction } from '@tiptap/pm/state';
import { MarkConfig } from '.';
import { Editor } from './Editor';
import { InputRule } from './InputRule';
import { Node } from './Node';
import { PasteRule } from './PasteRule';
import { Attributes, Extensions, GlobalAttributes, KeyboardShortcutCommand, ParentConfig, RawCommands } from './types';
declare module '@tiptap/core' {
    interface MarkConfig<Options = any, Storage = any> {
        [key: string]: any;
        /**
         * Name
         */
        name: string;
        /**
         * Priority
         */
        priority?: number;
        /**
         * Default options
         */
        defaultOptions?: Options;
        /**
         * Default Options
         */
        addOptions?: (this: {
            name: string;
            parent: Exclude<ParentConfig<MarkConfig<Options, Storage>>['addOptions'], undefined>;
        }) => Options;
        /**
         * Default Storage
         */
        addStorage?: (this: {
            name: string;
            options: Options;
            parent: Exclude<ParentConfig<MarkConfig<Options, Storage>>['addStorage'], undefined>;
        }) => Storage;
        /**
         * Global attributes
         */
        addGlobalAttributes?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addGlobalAttributes'];
        }) => GlobalAttributes | {};
        /**
         * Raw
         */
        addCommands?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addCommands'];
        }) => Partial<RawCommands>;
        /**
         * Keyboard shortcuts
         */
        addKeyboardShortcuts?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addKeyboardShortcuts'];
        }) => {
            [key: string]: KeyboardShortcutCommand;
        };
        /**
         * Input rules
         */
        addInputRules?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addInputRules'];
        }) => InputRule[];
        /**
         * Paste rules
         */
        addPasteRules?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addPasteRules'];
        }) => PasteRule[];
        /**
         * ProseMirror plugins
         */
        addProseMirrorPlugins?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addProseMirrorPlugins'];
        }) => Plugin[];
        /**
         * Extensions
         */
        addExtensions?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addExtensions'];
        }) => Extensions;
        /**
         * Extend Node Schema
         */
        extendNodeSchema?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['extendNodeSchema'];
        }, extension: Node) => Record<string, any>) | null;
        /**
         * Extend Mark Schema
         */
        extendMarkSchema?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['extendMarkSchema'];
        }, extension: Mark) => Record<string, any>) | null;
        /**
         * The editor is not ready yet.
         */
        onBeforeCreate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onBeforeCreate'];
        }) => void) | null;
        /**
         * The editor is ready.
         */
        onCreate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onCreate'];
        }) => void) | null;
        /**
         * The content has changed.
         */
        onUpdate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onUpdate'];
        }) => void) | null;
        /**
         * The selection has changed.
         */
        onSelectionUpdate?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onSelectionUpdate'];
        }) => void) | null;
        /**
         * The editor state has changed.
         */
        onTransaction?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onTransaction'];
        }, props: {
            transaction: Transaction;
        }) => void) | null;
        /**
         * The editor is focused.
         */
        onFocus?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onFocus'];
        }, props: {
            event: FocusEvent;
        }) => void) | null;
        /**
         * The editor isn’t focused anymore.
         */
        onBlur?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onBlur'];
        }, props: {
            event: FocusEvent;
        }) => void) | null;
        /**
         * The editor is destroyed.
         */
        onDestroy?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            editor: Editor;
            type: MarkType;
            parent: ParentConfig<MarkConfig<Options, Storage>>['onDestroy'];
        }) => void) | null;
        /**
         * Keep mark after split node
         */
        keepOnSplit?: boolean | (() => boolean);
        /**
         * Inclusive
         */
        inclusive?: MarkSpec['inclusive'] | ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['inclusive'];
            editor?: Editor;
        }) => MarkSpec['inclusive']);
        /**
         * Excludes
         */
        excludes?: MarkSpec['excludes'] | ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['excludes'];
            editor?: Editor;
        }) => MarkSpec['excludes']);
        /**
         * Marks this Mark as exitable
         */
        exitable?: boolean | (() => boolean);
        /**
         * Group
         */
        group?: MarkSpec['group'] | ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['group'];
            editor?: Editor;
        }) => MarkSpec['group']);
        /**
         * Spanning
         */
        spanning?: MarkSpec['spanning'] | ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['spanning'];
            editor?: Editor;
        }) => MarkSpec['spanning']);
        /**
         * Code
         */
        code?: boolean | ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['code'];
            editor?: Editor;
        }) => boolean);
        /**
         * Parse HTML
         */
        parseHTML?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['parseHTML'];
            editor?: Editor;
        }) => MarkSpec['parseDOM'];
        /**
         * Render HTML
         */
        renderHTML?: ((this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['renderHTML'];
            editor?: Editor;
        }, props: {
            mark: ProseMirrorMark;
            HTMLAttributes: Record<string, any>;
        }) => DOMOutputSpec) | null;
        /**
         * Attributes
         */
        addAttributes?: (this: {
            name: string;
            options: Options;
            storage: Storage;
            parent: ParentConfig<MarkConfig<Options, Storage>>['addAttributes'];
            editor?: Editor;
        }) => Attributes | {};
    }
}
export declare class Mark<Options = any, Storage = any> {
    type: string;
    name: string;
    parent: Mark | null;
    child: Mark | null;
    options: Options;
    storage: Storage;
    config: MarkConfig;
    constructor(config?: Partial<MarkConfig<Options, Storage>>);
    static create<O = any, S = any>(config?: Partial<MarkConfig<O, S>>): Mark<O, S>;
    configure(options?: Partial<Options>): Mark<Options, Storage>;
    extend<ExtendedOptions = Options, ExtendedStorage = Storage>(extendedConfig?: Partial<MarkConfig<ExtendedOptions, ExtendedStorage>>): Mark<ExtendedOptions, ExtendedStorage>;
    static handleExit({ editor, mark }: {
        editor: Editor;
        mark: Mark;
    }): boolean;
}
