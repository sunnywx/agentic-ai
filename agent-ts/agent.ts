// Agent class
export default class Agent {
  constructor(
    public name: string='Agent',
    public model: string = 'gpt-3.5-turbo',
    public instruction: string = 'You are a helpful assistant.',
  ) {}
}