// const util = require('util');
import util from 'util'
import * as acorn from 'acorn'

export function functionToJsonSchema(fx: Function) {
  // Get the function's string representation
  const fnStr = fx.toString();

  // Extract function name
  const nameMatch = fnStr.match(/function\s+(\w+)/);
  const name = nameMatch ? nameMatch[1] : 'anonymous';

  // Extract comments (assuming they're right before the function declaration)
  const commentMatch = fnStr.match(/\/\*\*([\s\S]*?)\*\//);
  const description = commentMatch
      ? commentMatch[1].replace(/\s*\*\s?/g, '').trim()
      : '';

  // Extract parameters
  const paramsMatch = fnStr.match(/\(([^)]*)\)/);
  const params = paramsMatch ? paramsMatch[1].split(',').map(p => p.trim()) : [];

  // Create JSON schema
  const schema = {
      name,
      description,
      parameters: {
          type: 'object',
          properties: {},
          required: [],
          additionalProperties: false
      }
  };

  // Add parameters to the schema
  params.forEach(param => {
      const [paramName, defaultValue] = param.split('=');
      schema.parameters.properties[paramName] = {
          type: 'string', // Default to string, you might want to infer types in a more sophisticated way
          description: '' // You could parse individual parameter comments here
      };
      if (!defaultValue) {
          schema.parameters.required.push(paramName);
      }
  });

  return schema;
}


export function functionToJson(func) {
    /**
     * Converts a JavaScript function into a JSON-serializable object
     * that describes the function's signature, including its name,
     * description, and parameters.
     *
     * @param {Function} func - The function to be converted.
     * @returns {Object} - An object representing the function's signature in JSON format.
     */

    const typeMap = {
        String: "string",
        Number: "number",
        Boolean: "boolean",
        Array: "array",
        Object: "object",
        null: "null",
    };

    const parameters = {};
    const required = [];

    // Get the function's parameter names and types
    const paramNames = util.inspect(func).match(/\(([^)]*)\)/)?.[1]?.split(',')?.map(param => param.trim()) || [];
    
    paramNames.forEach(param => {
        // In JavaScript, there's no direct way to get parameter types, so we assume 'string' as default
        const paramType = typeMap.String || "string";
        parameters[param] = { type: paramType };
        required.push(param);
    });

    return {
        type: "function",
        function: {
            name: func.name,
            description: func.toString().match(/\/\*[\s\S]*?\*\//)?.[0]?.replace(/\/\*|\*\//g, '') || "",
            parameters: {
                type: "object",
                properties: parameters,
                required: required,
            },
        },
    };
}

// implement-3: using acorn to parse ast
export function functionToJsonAcorn(func) {
    /**
     * Converts a JavaScript function into a JSON-serializable object
     * that describes the function's signature, including its name,
     * description, and parameters.
     *
     * @param {Function} func - The function to be converted.
     * @returns {Object} - An object representing the function's signature in JSON format.
     */

    const typeMap = {
        String: "string",
        Number: "number",
        Boolean: "boolean",
        Array: "array",
        Object: "object",
        null: "null",
    };

    // if(typeof func === 'string'){
    //     console.log(func)

    //     // try to eval func, danger
    //     try{
    //         func=eval(func)
    //         console.log(func)
    //     } catch(err){
    //         throw err
    //     }
    // }

    const functionSource = func.toString();

    let comments=[]

    const ast = acorn.parse(functionSource, { 
        ecmaVersion: 'latest',
        onComment: comments,
        // locations: true
    });

    const functionNode = ast.body[0];
    if (functionNode.type !== 'FunctionDeclaration') {
        throw new Error('Expected a function declaration');
    }

    // todo: handle arrow function

    const parameters = {};
    const required = [];

    functionNode.params.forEach(param => {
        if (param.type === 'Identifier') {
            // In JavaScript, there's no direct way to get parameter types, so we assume 'string' as default
            // maybe we need typescript as parser
            const paramType = typeMap.String || "string";
            parameters[param.name] = { type: paramType };
            required.push(param.name);
        } else if (param.type === 'AssignmentPattern') {
            // Handle default parameters
            const paramType = typeMap.String || "string";
            parameters[param.left.name] = { type: paramType };
        }
    });

    const description = functionNode.body.body
        .find(node => node.type === 'BlockStatement' && node.body.length > 0 && node.body[0].type === 'ExpressionStatement' && node.body[0].expression.type === 'Literal')
        ?.body[0]?.expression?.value || '';

    // Extract the docstring from comments
    // let description = '';
    // console.log('comments:', comments)
    // for (const comment of comments) {
    //     if (comment.type === 'Block' && comment.loc.start.line === functionNode.loc.start.line - 1) {
    //         description = comment.value.replace(/\*\//g, '').replace(/\/\*/g, '').trim();
    //         break;
    //     }
    // }

    return {
        type: "function",
        function: {
            name: functionNode.id.name,
            description: description,
            parameters: {
                type: "object",
                properties: parameters,
                required: required,
            },
        },
    };
}


