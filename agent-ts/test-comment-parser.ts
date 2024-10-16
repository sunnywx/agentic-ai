import {parse} from 'comment-parser'

const source=`
/**
   * This is an example function.
   * 
   * @param {string} param111   the name param
   * @param {number} param2    second param
   */
function exampleFunction(param1, param2) {
  
}
`

const pretty=(obj: Object)=> console.log(JSON.stringify(obj, null, 2))

pretty(parse(source.toString()))