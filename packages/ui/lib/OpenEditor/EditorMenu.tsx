import { useCallback } from 'react';
import {
  BiHeading,
  BiBold,
  BiItalic,
  BiStrikethrough,
  BiCodeBlock,
  BiParagraph,
  BiLink,
  BiListOl,
  BiListUl,
  BiCode,
  BiUndo,
  BiRedo,
} from 'react-icons/bi';
import { Flex, Icon, IconButton } from '@chakra-ui/react';

type EditorMenuProps = {
  editor: any;
  isDisabled?: boolean;
};

export const EditorMenu = ({ editor, isDisabled = false }: EditorMenuProps) => {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <Flex
      wrap="wrap"
      w="100%"
      bg="gray_1"
      h="fit-content"
      roundedTop="xl"
      align="center"
      justify="flex-end"
      pr="10px"
    >
      <IconButton
        p="0px"
        bg="transparent"
        aria-label="Titulo"
        isDisabled={isDisabled}
        icon={
          <Icon
            as={BiHeading}
            boxSize="20px"
            color={editor.isActive('heading') ? 'primary' : 'black'}
          />
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Párrafo"
        bg="transparent"
        icon={
          <Icon
            as={BiParagraph}
            boxSize="20px"
            color={editor.isActive('paragraph') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().setParagraph().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Negrita"
        bg="transparent"
        icon={
          <Icon
            as={BiBold}
            boxSize="20px"
            color={editor.isActive('bold') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Cursiva"
        bg="transparent"
        icon={
          <Icon
            as={BiItalic}
            boxSize="20px"
            color={editor.isActive('italic') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Tachado"
        bg="transparent"
        icon={
          <Icon
            as={BiStrikethrough}
            boxSize="20px"
            color={editor.isActive('strike') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Código"
        bg="transparent"
        icon={
          <Icon
            as={BiCode}
            boxSize="20px"
            color={editor.isActive('code') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().toggleCode().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Enlace"
        bg="transparent"
        icon={
          <Icon
            as={BiLink}
            boxSize="20px"
            color={editor.isActive('link') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={setLink}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Lista ordenada"
        bg="transparent"
        icon={
          <Icon
            as={BiListOl}
            boxSize="20px"
            color={editor.isActive('orderedList') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Lista desordenada"
        bg="transparent"
        icon={
          <Icon
            as={BiListUl}
            boxSize="20px"
            color={editor.isActive('bulletList') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Bloque código"
        bg="transparent"
        icon={
          <Icon
            as={BiCodeBlock}
            boxSize="20px"
            color={editor.isActive('codeBlock') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Deshacer"
        bg="transparent"
        icon={
          <Icon
            as={BiUndo}
            boxSize="20px"
            color={editor.isActive('undo') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().undo().run()}
        style={{ padding: '0' }}
      />

      <IconButton
        p="0px"
        isDisabled={isDisabled}
        aria-label="Rehacer"
        bg="transparent"
        icon={
          <Icon
            as={BiRedo}
            boxSize="20px"
            color={editor.isActive('redo') ? 'primary' : 'black'}
          />
        }
        className="icon"
        onClick={() => editor.chain().focus().redo().run()}
        style={{ padding: '0' }}
      />
    </Flex>
  );
};
