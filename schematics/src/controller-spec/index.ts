import { Rule, SchematicContext, Tree, apply, chain, mergeWith, template, url, strings, move } from '@angular-devkit/schematics';

interface ControllerSpecOptions {
  name: string;
  path: string;
}

export function generate(options: ControllerSpecOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let { path, name } = options;

    if (!path.endsWith('/')) {
      path = `${path}/`;
    }
    if (!path.startsWith('./')) {
      path = `./${path}`;
    }

    if (name.endsWith('s')) {
      name = name.replace(/s$/, '');
    }

    const validatedOptions = { ...options, name: name, path: path };

    const templateSource = apply(url('./files/tests'), [template({ ...validatedOptions, ...strings }), move(`${path}/tests`)]);
    const mockTemplateSource = apply(url('./files/mocks'), [template({ ...validatedOptions, ...strings }), move(`${path}/__mocks__`)]);
    return chain([mergeWith(templateSource), mergeWith(mockTemplateSource)]);
  };
}
