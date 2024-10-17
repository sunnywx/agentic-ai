import {parse} from 'comment-parser'

/**
 * Tagged template to enhance any function, with extra hidden props: name, desc, parameters
 * when used with llm function calling, should define function wrapped with func``
 * thus can help generate function json schema, include name, description/doc-string, parameters
 * 
 * @param strings {Array} doc string chunks
 * @param target  {Function} target function
 * @returns {Function}
 */
export function func(strings, target) {
  if (typeof target !== "function") {
    // target = () => {};
    return target
  }

  // must place docstring at first when pass string to this func
  const doc_string = strings.join("").trim();

  // parse description, param list from parsed ast
  const ast=parse(doc_string)[0] || {}

  const required: string[] = []
  const params=ast.tags.filter(v=> v.tag === 'param').map(v=> ({
    name: v.name,
    type: v.type,
    optional: v.optional,
    description: v.description
  })).reduce((acc, cur)=> {
    acc[cur.name]={
      type: cur.type,
      description: cur.description
    }
    if(cur.optional === false){
      required.push(cur.name)
    }
    return acc
  }, {})

  target.__doc = doc_string;
  target.__name = target.name;
  // target.__source = target.toString();
  target.__schema={
    name: target.__name,
    description: ast.description,
    parameters: {
      type: "object",
      properties: params,
      required,
      additionalProperties: false,
    }
  }

  return target;
}