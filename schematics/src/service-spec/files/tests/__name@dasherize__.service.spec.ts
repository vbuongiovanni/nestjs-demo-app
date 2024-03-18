import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { <%= classify(name) %>Service } from '../<%= dasherize(name) %>.service';
import { userRequestObject, test<%= classify(singularName) %>1Id, create<%= classify(singularName) %>RequestBody, update<%= classify(singularName) %>RequestBody } from './<%= dasherize(name) %>.stub';
import { Mock<%= classify(name) %>Model, create<%= classify(singularName) %>Stub, deleteOne<%= classify(singularName) %>Stub, find<%= classify(name) %>Stub, findOne<%= classify(singularName) %>Stub, findOneAndUpdate<%= classify(singularName) %>Stub } from "../__mocks__/<%= dasherize(name) %>.model";
import { <%= classify(singularName) %>, <%= classify(singularName) %>Document } from '@doorcast/shared/mongodb';
<%= (dependencyModels.map(modelName => `import { ${modelName}, ${modelName}Document } from '@doorcast/shared/mongodb';`).join('\n')) %>
<%= (dependencyModels.map(modelName => `import { Mock${modelName}Model } from "../__mocks__/dependencies.model";`).join('\n')) %>


describe('<%= classify(singularName) %>Service', () => {
  let <%= camelize(name) %>Service: <%= classify(name) %>Service;
  let mock<%= classify(singularName) %>Model: Model<<%= classify(singularName) %>Document>;
  <%= (dependencyModels.map(name => `let mock${name}Model : Model<${name}Document>;`).join('\n  ')) %>


  // Manually the names of all the methods that have tests written:
  const testedMethods = [
    'create<%= classify(singularName) %>',
    'get<%= classify(name) %>',
    'get<%= classify(singularName) %>',
    'update<%= classify(singularName) %>',
    'delete<%= classify(singularName) %>'
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [<%= classify(name) %>Service],
      providers: [
        <%= classify(name) %>Service,
        {
          provide: getModelToken(<%= classify(singularName) %>.name),
          useClass: Mock<%= classify(name) %>Model,
        },
        <%= (dependencyModels.map(name => `{\nprovide: getModelToken(${name}.name),\n  useClass: Mock${name}Model,\n},`).join('\n')) %>
      ],
    }).compile();

    <%= camelize(name) %>Service = module.get<<%= classify(name) %>Service>(<%= classify(name) %>Service);
    mock<%= classify(singularName) %>Model = module.get<Model<<%= classify(singularName) %>Document>>(getModelToken(<%= classify(singularName) %>.name));
    <%= (dependencyModels.map(name => `mock${name}Model = module.get<Model<${name}Document>>(getModelToken(${name}.name))`).join('\n    ')) %>

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the <%= classify(singularName) %>Service', () => {
    it('All methods should have a unit test', async () => {
      const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(<%= camelize(name) %>Service)).filter((name) => name !== 'constructor');

      expect(propertyNames.sort()).toEqual(testedMethods.sort());
    });
  });

  describe('create<%= classify(singularName) %>', () => {
    describe('Given the correct arguments', () => {
      describe('When the create<%= classify(singularName) %> method is called', () => {
        let <%= singularName %>: <%= classify(singularName) %>;
        const companyId = userRequestObject.user.company._id;

        beforeEach(async () => {
          <%= singularName %> = await <%= name %>Service.create<%= classify(singularName) %>(companyId, create<%= classify(singularName) %>RequestBody);
        });

        it('then it should call create from the mock<%= classify(singularName) %>Model', async () => {
          const spy = jest.spyOn(mock<%= classify(singularName) %>Model, 'create');
          expect(spy).toBeCalled();
        });

        it('and it should return the <%= singularName %> document', async () => {
          expect(<%= singularName %>).toEqual(create<%= classify(singularName) %>Stub());
        });
      });
    });
  });

  // Assumes that findOneAndUpdate is used - if not, replace with the appropriate mongoose operation
  describe('update<%= classify(singularName) %>', () => {
    describe('Given the correct arguments', () => {
      describe('When the update<%= classify(singularName) %> method is called', () => {
        let value: <%= classify(singularName) %>;
        const companyId = userRequestObject.user.company._id;
        const <%= singularName %>Id = test<%= classify(singularName) %>1Id;

        beforeEach(async () => {
          value = await <%= camelize(name) %>Service.update<%= classify(singularName) %>(companyId, <%= singularName %>Id, update<%= classify(singularName) %>RequestBody);
        });

        it('then it should call findOneAndUpdate from the mock<%= classify(singularName) %>Model', async () => {
          const spy = jest.spyOn(mock<%= classify(singularName) %>Model, 'findOneAndUpdate');
          expect(spy).toBeCalled();
        });

        it('then it return the newly updated <%= singularName %>', async () => {
          expect(value).toEqual(findOneAndUpdate<%= classify(singularName) %>Stub());
        });
      });
    });
  });

  describe('get<%= classify(singularName) %>', () => {
    describe('Given the correct arguments', () => {
      describe('When the get<%= classify(singularName) %> method is called', () => {
        let <%= singularName %>: <%= classify(singularName) %>;
        const companyId = userRequestObject.user.company._id;
        const <%= singularName %>Id = test<%= classify(singularName) %>1Id;

        beforeEach(async () => {
          <%= singularName %> = await <%= camelize(name) %>Service.get<%= classify(singularName) %>(companyId, <%= singularName %>Id);
        });

        it('then it should call findOne from the mock<%= classify(singularName) %>Model', async () => {
          const spy = jest.spyOn(mock<%= classify(singularName) %>Model, 'findOne');
          expect(spy).toBeCalled();
        });

        it('then it return the lean <%= singularName %> document', async () => {
          expect(<%= singularName %>).toEqual(findOne<%= classify(singularName) %>Stub());
        });
      });
    });
  });

  describe('get<%= classify(name) %>', () => {
    describe('Given the correct arguments', () => {
      describe('When the get<%= classify(singularName) %> method is called', () => {
        let <%= name %>: <%= classify(singularName) %>[];
        const companyId = userRequestObject.user.company._id;

        beforeEach(async () => {
          <%= name %> = await <%= camelize(name) %>Service.get<%= classify(name) %>(companyId);
        });

        it('then it should call find from the mock<%= classify(singularName) %>Model', async () => {
          const spy = jest.spyOn(mock<%= classify(singularName) %>Model, 'find');
          expect(spy).toBeCalled();
        });

        it('then it return an array of lean <%= singularName %> documents', async () => {
          expect(<%= name %>).toEqual(find<%= classify(name) %>Stub());
        });
      });
    });
  });

  describe('delete<%= classify(singularName) %>', () => {
    describe('Given the correct arguments', () => {
      describe('When the delete<%= classify(singularName) %> method is called', () => {
        let deleteResult: DeleteResult | Error;
        const companyId = userRequestObject.user.company._id;
        const <%= singularName %>Id = test<%= classify(singularName) %>1Id;

        beforeEach(async () => {
          deleteResult = await <%= camelize(name) %>Service.delete<%= classify(singularName) %>(companyId, <%= singularName %>Id);
        });

        it('then it should call deleteOne from the mock<%= classify(singularName) %>Model', async () => {
          const spy = jest.spyOn(mock<%= classify(singularName) %>Model, 'deleteOne');
          expect(spy).toBeCalled();
        });

        it('and it should return DeleteResult', async () => {
          expect(deleteResult).toEqual(deleteOne<%= classify(singularName) %>Stub());
        });
      });
    });
  });


});
