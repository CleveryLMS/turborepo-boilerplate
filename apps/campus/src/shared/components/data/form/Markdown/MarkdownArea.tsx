import ReactQuill from 'react-quill';
import './MarkdownArea.scss';

export const MarkdownArea = ({ placeholder, value, onChange = () => {} }: any) => {
  return (
    <ReactQuill
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      style={{
        width: '100%',
        minHeight: '237px',
        height: 'fit-content',
        borderRadius: '12px',
        color: 'var(--chakra-colors-black)',
        border: '1px solid var(--chakra-colors-gray_3)',
        backgroundColor: 'var(--chakra-colors-white)',
      }}
    />
  );
};
