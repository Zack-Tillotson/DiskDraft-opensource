// The list of clients which have connected to the draft

export default function(attr) {
  return function(pipeline, action) {

    const ret = [];

    Object.keys(pipeline[attr]).forEach(uid => {
      ret.push({...pipeline[attr][uid], uid});
    })

    return ret;

  }
}