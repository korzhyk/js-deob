const { js_beautify } = require('js-beautify')

module.exports = function (code, beautifyOptions={ indent_size: 2, unescape_strings: true }) {
  let beautified = js_beautify(code, beautifyOptions)
  const arrayVarList = findArrayVars(beautified)
  console.log('Array variables', arrayVarList)
  arrayVarList.forEach(variable => {
    let arrayOfVars = findVarsArray(beautified, variable)
    if (arrayOfVars !== null && Array.isArray(arrayOfVars)) {
      beautified = replaceArrayVars(beautified, variable, arrayOfVars)
    }
  })
  return beautified
}

function findArrayVars (code, pattern=/(\w+)\[(\d+)\]/g) {
  let vars = [], matched

  while((matched = pattern.exec(code)) !== null) {
    let [ _, name ] = matched
    ~vars.indexOf(name) || vars.push(name)
  }
  return vars
}

function findVarsArray (code, name) {
  const pattern = new RegExp(`var ${name} = (\\[.+\\]);`)
  let matched = pattern.exec(code)
  if (matched !== null) {
    let [ _, array ] = matched
    return JSON.parse(array)
  } else {
    return null
  }
}

function replaceArrayVars (code, name, vars) {
  vars.forEach((value, idx) => {
    code = replaceAll(code, new RegExp(`var ${name} .+;`, 'g')) // Remove var array
    code = replaceAll(code, `[${name}[${idx}]]`, `.${value}`) // Replace if method
    code = replaceAll(code, `${name}[${idx}]`, `'${value}'`) // Replace if variable
  })
  return code
}


function replaceAll (str, find, replace='') {
  find = find instanceof RegExp ? find : new RegExp(escapeRegExp(find), 'g')
  return str.replace(find, replace)
}

function escapeRegExp (str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$&')
}