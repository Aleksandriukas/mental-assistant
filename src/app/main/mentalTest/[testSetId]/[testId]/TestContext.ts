import {createSafeContext, useSafeContext} from '@sirse-dev/safe-context';

type TestContextType = {
  clientAnswers: string[];
  setClientAnswers: React.Dispatch<React.SetStateAction<string[]>>;
};

export const TestContext = createSafeContext<TestContextType>();

export const useTestContext = () => {
  return useSafeContext(TestContext);
};
