const pickAttributes = dependencies => (basic, pipeline, action) => {
  const ret = {};
  dependencies.forEach(depName => {

    const depShortName = depName.split('.').pop();

    let dep = getPath(pipeline, depName);
    if(dep !== undefined) {
      return ret[depShortName] = dep;
    }

    dep = getPath(basic, depName);
    if(dep !== undefined ) {
      return ret[depShortName] = dep;
    }

    if(__DEBUG__) {
      console.log(`Draft Reducer - higher order : Error, no dependency found with name "${depName}"`);
    }
  });
  return ret;
}

function getPath(obj, path) {
  let pathPtr = obj;
  let found = true;
  path.split('.').forEach(step => {
    if(typeof pathPtr[step] === 'undefined') {
      found = false;
      return undefined;
    } else {
      pathPtr = pathPtr[step];
    }
  });

  if(!found) {
    return undefined;
  }

  return pathPtr;
}

export {pickAttributes}