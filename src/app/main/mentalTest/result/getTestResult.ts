type Result = 'Good' | 'Average' | 'Bad';

export type ResultType = {
  result: Result;
  description: string;
};

export const getTestResult = (): Promise<ResultType> => {
  // TODO Change this mock promise to real data fetching @DungBui
  return new Promise(resolve => {
    const result: ResultType = {
      result: 'Good',
      description:
        'Congratulations! You have passed the test with flying colors!',
    };
    resolve(result);
  });
};
