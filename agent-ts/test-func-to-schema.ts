import { util } from 'zod';
import { functionToJsonSchema, functionToJson, functionToJsonAcorn } from './utils/func-to-schema';

// This is the function that we want the model to be able to call
const getDeliveryDate = async (orderId: string): datetime => { 
  const connection = await createConnection({
      host: 'localhost',
      user: 'root',
      // ...
  });
}

const source=`
// Example usage
function exampleFunction(param1, param2) {
  /**
   * This is an example function.
   */
}
`

const pretty=(obj: Object)=> console.log(JSON.stringify(obj, null, 2))

pretty(functionToJsonAcorn(source))