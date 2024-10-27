export type QuestionType = {
  question: string;
  answers: string[];
};

export const getTest = (): Promise<QuestionType[]> => {
  // TODO Change this mock promise to real data fetching @DungBui
  return new Promise(resolve => {
    const testsInfo: QuestionType[] = [
      {
        question: 'What is the capital of France?',
        answers: ['Paris', 'London', 'Berlin', 'Madrid'],
      },
      {
        question: 'What is the capital of Germany?',
        answers: ['Berlin', 'London', 'Paris', 'Madrid'],
      },
      {
        question: 'What is the capital of Spain?',
        answers: ['Madrid', 'London', 'Paris', 'Berlin'],
      },
      {
        question: 'What is the capital of the United Kingdom?',
        answers: ['London', 'Berlin', 'Paris', 'Madrid'],
      },
    ];

    setTimeout(() => resolve(testsInfo), 1000); // 1-second delay
  });
};
