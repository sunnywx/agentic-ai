// import {
//   functionToJsonSchema,
//   functionToJson,
//   functionToJsonAcorn,
// } from "./utils/func-to-schema";
import {func} from './utils/enhance-func'
import {prettyPrint} from './utils'

// 1. use eval to exec function str

// 2. use new Function to exec func str, better than eval

// 3. template literal tag, inspire by gql``

const get_weather = func`
/**
 * get weather of given city
 * 
 * @param {string} city  the city
 * @param {number} [lag=11]  optional param
 */
${function get_weather(city, lag=11) {
  // only use normal function, arrow function will parse failed
  console.log("get weather:", city, lag);
}}
`;

console.log(get_weather);
// console.log(get_weather("wh"));

prettyPrint(get_weather.__schema)
