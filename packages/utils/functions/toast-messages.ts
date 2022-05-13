import { FailureToastComponent, WarningToastComponent, SuccessToastComponent, SuccessToastComponent_Undo } from 'ui';

const onSuccess = (toast: any, title: string | React.ReactNode, duration = 3000) => {
  toast({
    duration: duration,
    isClosable: true,
    render: () => SuccessToastComponent(title),
  });
};

const onSuccess_Undo = (toast: any, title: string | React.ReactNode, timeout: any, duration = 5000) => {
  toast({
    duration: duration,
    isClosable: true,
    render: () => SuccessToastComponent_Undo(title, timeout),
  });
};

const onFailure = (toast: any, title: string | React.ReactNode, description: string | React.ReactNode, duration = 5000) => {
  toast({
    duration: duration,
    isClosable: true,
    render: () => FailureToastComponent(title, description),
  });
};

const onWarning = (toast: any, title: string | React.ReactNode, description: string | React.ReactNode, duration = 5000) => {
  toast({
    duration: duration,
    isClosable: true,
    render: () => WarningToastComponent(title, description),
  });
};

export { onSuccess, onSuccess_Undo, onFailure, onWarning };
