import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Select } from '@chakra-ui/react';

import './CodeBlockComponent.scss';

const CodeBlockComponent = (props: any) => {
  const { node, updateAttributes, extension } = props;
  const {
    attrs: { language: defaultLanguage },
  } = node;

  return (
    <NodeViewWrapper className="code-block">
      <Select
        mt="5px"
        mr="8px"
        size="sm"
        rounded="lg"
        right="0"
        w="fit-content"
        fontSize="12px"
        position="absolute"
        textTransform="capitalize"
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        <option disabled>—</option>

        {extension.options.lowlight
          .listLanguages()
          .map((lang: any, index: number) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
      </Select>

      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
