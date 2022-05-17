import { ChakraProvider } from '@chakra-ui/react';

import { Button } from '@clevery/ui';

const App = () => {
  return (
    <ChakraProvider>
      <div>Hola mundo</div>

      <Button text="AAAH" />
    </ChakraProvider>
  );
};

export default App;
