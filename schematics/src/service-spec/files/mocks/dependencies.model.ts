import { jest } from '@jest/globals';

<%= (dependencyModels.map(modelName => `export const Mock${modelName}Model = jest.fn().mockReturnValue({});`).join('\n\n')) %>