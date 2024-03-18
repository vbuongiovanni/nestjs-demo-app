import { Rule, SchematicContext, Tree, apply, chain, mergeWith, move, strings, template, url } from '@angular-devkit/schematics';

interface ServiceSpecOptions {
  name: string;
  path: string;
  dependencies: string;
}

export function generate(options: ServiceSpecOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let { path, name: nameRaw, dependencies } = options;
    const name = nameRaw.toLowerCase();

    if (path) {
      if (!path.endsWith('/')) {
        path = `${path}/`;
      }
      path = path.replace(/^\.\//, '');
    } else {
      path = `api/${name}`;
    }

    path = `./src/modules/${path}`;

    let singularName = '';

    if (name.endsWith('ies')) {
      singularName = name.replace(/ies$/, 'y');
    } else {
      singularName = name.replace(/s$/, '');
    }

    const dependenciesArray = dependencies.split(',').map((modelName) => modelName.replace(/\s/g, ''));
    const dependencyModels = dependenciesArray
      .filter((modelName) => modelName !== '' && modelName.toLowerCase() !== singularName.toLowerCase())
      .map((modelName) => {
        const propertyModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
        if (propertyModelName.endsWith('ies')) {
          return propertyModelName.replace(/ies$/, 'y');
        } else {
          return propertyModelName.replace(/s$/, '');
        }
      });

    const spaceSeparatedName = name
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const spaceSeparatedSingularName = singularName
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const validatedOptions = {
      ...options,
      name: name.toLowerCase(),
      path,
      singularName: singularName.toLowerCase(),
      spaceSeparatedName,
      spaceSeparatedSingularName,
      dependencyModels,
    };

    const templateSource = apply(url('./files/tests'), [template({ ...validatedOptions, ...strings }), move(`${path}/tests`)]);
    const mockTemplateSource = apply(url('./files/mocks'), [template({ ...validatedOptions, ...strings }), move(`${path}/__mocks__`)]);
    return chain([mergeWith(templateSource), mergeWith(mockTemplateSource)]);
  };
}
