import { useEffect } from 'react';

import { Flex } from '@chakra-ui/react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';

import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowLight from '@tiptap/extension-code-block-lowlight';
import CodeBlockComponent from './TipTapSyntaxisHighlighter/CodeBlockComponent';

import { lowlight } from 'lowlight/lib/core';

import { EditorMenu } from './EditorMenu';

import './OpenEditor.scss';
import './CodeStyles.scss';

interface OpenEditorProps {
  value: string;
  isDisabled?: boolean;
  placeholder?: string;
  updateDataOnChange?: boolean;
  onFocus?: () => void;
  onChange: (e: any) => void;
}

export const OpenEditor = ({
  value,
  isDisabled,
  placeholder,
  updateDataOnChange,
  onFocus = () => {},
  onChange = () => {},
}: OpenEditorProps) => {
  const editor = useEditor({
    content: value || '',
    onFocus: onFocus,
    extensions: [
      Link,
      StarterKit,
      Image.configure({ inline: true }),
      Placeholder.configure({ placeholder: placeholder }),
      CodeBlockLowLight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
  });

  useEffect(() => {
    let html = editor?.getHTML()
    if (html !== value) editor?.commands.setContent(value, false);
  }, [value]);

  //* Solución encontrada: https://github.com/ueberdosis/tiptap/issues/2403#issuecomment-1017840603 */
  useEffect(() => {
    editor?.off('blur');
    editor?.on('blur', ({ editor: updatedEditor }) => {
      onChange(
        updatedEditor.getHTML() === '<p></p>' ? '' : updatedEditor.getHTML()
      );
    });

    editor?.off('update');
    editor?.on('update', ({ editor: updatedEditor }) => {
      if (updateDataOnChange)
        onChange(
          updatedEditor.getHTML() === '<p></p>' ? '' : updatedEditor.getHTML()
        );
    });
  }, [editor, onChange]);

  return (
    <Flex
      w="100%"
      minH="195"
      bg="white"
      rounded="xl"
      direction="column"
      border="1px solid var(--chakra-colors-gray_3)"
    >
      <EditorMenu editor={editor} isDisabled={isDisabled} />

      <Flex p="12px" boxSize="100%">
        <div style={{ width: '100%' }}>
          <EditorContent
            data-cy="contenido_pregunta_open_editor"
            editor={editor}
            disabled={isDisabled}
          />
        </div>
      </Flex>
    </Flex>
  );
};
