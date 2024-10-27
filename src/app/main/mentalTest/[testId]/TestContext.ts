import {createSafeContext, useSafeContext} from '@sirse-dev/safe-context';

type TestContextType = {
  clientAnswers: number[];
  setClientAnswers: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TestContext = createSafeContext<TestContextType>();

export const useTestContext = () => {
  return useSafeContext(TestContext);
};
