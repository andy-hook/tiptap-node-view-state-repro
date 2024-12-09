import * as React from "react";

import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  mergeAttributes,
  NodeViewWrapper,
  NodeViewProps,
  BubbleMenu,
} from "@tiptap/react";

import * as Y from "yjs";

import { Editor, Node } from "@tiptap/core";

import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";

import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";

export default function EditorComponent() {
  const readyRef = React.useRef(false);
  const document = React.useMemo(() => new Y.Doc(), []);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,

      Node.create({
        name: "react-component",
        group: "block",
        atom: true,

        addAttributes() {
          return {
            id: {
              default: null,
            },
          };
        },

        renderHTML({ HTMLAttributes }) {
          return ["react-component", mergeAttributes(HTMLAttributes)];
        },

        parseHTML() {
          return [
            {
              tag: "react-component",
            },
          ];
        },

        addNodeView() {
          return ReactNodeViewRenderer(ReactComponent);
        },
      }),

      // Disabling placeholder resolves the issue
      Placeholder.configure(),

      // disabling collaboration also resolves the issue
      Collaboration.configure({
        document,
      }),
    ],
  });

  React.useEffect(() => {
    // Avoid flushsync error by not setting content during render
    if (readyRef.current) return;
    setTimeout(() => {
      console.warn("setContent");
      editor?.commands.setContent(initialContent, false);
    });

    readyRef.current = true;
  }, [editor]);

  return (
    <>
      {editor && <Menu editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
}

const ReactComponent = ({ node }: NodeViewProps) => {
  const [clicked, setClicked] = React.useState(0);

  return (
    <NodeViewWrapper>
      <button
        onClick={() => {
          setClicked((prev) => prev + 1);
        }}
        style={{ backgroundColor: clicked ? "red" : undefined }}
      >
        id: {node.attrs.id} Click me {clicked}
      </button>
    </NodeViewWrapper>
  );
};

const Menu = ({ editor }: { editor: Editor }) => {
  const [mountMenu, setMountMenu] = React.useState(false);

  return (
    <>
      <button onClick={() => setMountMenu(true)}>
        {mountMenu ? "Registered!" : "Register menu"}
      </button>
      {mountMenu && <BubbleMenu editor={editor}>Stuff</BubbleMenu>}
    </>
  );
};

const initialContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
    {
      type: "react-component",
      attrs: {
        id: "1",
      },
    },
    {
      type: "paragraph",
    },
    {
      type: "react-component",
      attrs: {
        id: "2",
      },
    },
    {
      type: "paragraph",
    },
    {
      type: "react-component",
      attrs: {
        id: "3",
      },
    },
    {
      type: "paragraph",
    },
    {
      type: "react-component",
      attrs: {
        id: "4",
      },
    },
  ],
};
