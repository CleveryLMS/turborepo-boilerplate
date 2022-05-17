import { ChakraProvider } from '@chakra-ui/react';
import { Button } from '@clevery/ui';

const App = () => {
  return (
    <ChakraProvider>
      <div>Hola mundo</div>

      <Button />
    </ChakraProvider>
  );
};

export default App;
