export type TestInfoType = {
  id: number;
  title: string;
  shortDescription: string; // max 2 sentences
  time: number; // in minutes
  icon?: string;
  completed: boolean;
};

export const getTestsInfo = (): Promise<TestInfoType[]> => {
  //TODO Change this mock promise to real data fetching @DungBui
  return new Promise(resolve => {
    const testsInfo: TestInfoType[] = [
      {
        id: 0,
        title: 'Memory Test',
        shortDescription: 'A test to evaluate your memory skills.',
        time: 5,
        icon: 'brain',
        completed: false,
      },
      {
        id: 1,
        title: 'Attention Test',
        shortDescription: 'A test to measure your attention span.',
        time: 10,
        icon: 'eye',
        completed: true,
      },
      {
        id: 2,
        title: 'Cognitive Flexibility Test',
        shortDescription: 'A test to assess your cognitive flexibility.',
        time: 15,
        icon: 'shuffle',
        completed: false,
      },
      {
        id: 3,
        title: 'Problem Solving Test',
        shortDescription: 'A test to gauge your problem-solving abilities.',
        time: 5,
        icon: 'puzzle',
        completed: false,
      },
    ];
    resolve(testsInfo);
  });
};
