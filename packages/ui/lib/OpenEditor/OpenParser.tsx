import { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { textParserMd } from 'utils';

import { lowlight } from 'lowlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import './OpenEditor.scss';
import './CodeStyles.scss';

interface OpenParserProps {
  value: string;
}

export const OpenParser = ({ value = '' }: OpenParserProps) => {
  const editor = useEditor({
    editable: false,
    content: textParserMd(value),
    extensions: [StarterKit, Link, Image.configure({ inline: true }), CodeBlockLowlight.configure({ lowlight })],
  });

  useEffect(() => {
    editor?.commands.setContent(textParserMd(value));
  }, [value]);

  return (
    <Flex w="100%" bg="transparent" className="editor-container" maxW="100%">
      <EditorContent editor={editor} id="open-parser" data-cy="editor_content_father" />
    </Flex>
  );
};
