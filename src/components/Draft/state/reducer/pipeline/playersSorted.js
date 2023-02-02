// Sort the players

const sortFns = (attr, type, dirTxt = 'asc') => {

  const textFn = (a, b) => (a[attr].toLowerCase() === b[attr].toLowerCase() ? 0 : a[attr].toLowerCase() > b[attr].toLowerCase() ? 1 : -1) * dir;
  const numberFn = (a, b) => (parseFloat(b[attr] ||  0) - parseFloat(a[attr]) || 0) * dir;
  const imageNameFn = {
    asc: (a, b) => (b.last_name > a.last_name ? 1 : -1),
    desc: (a, b) => (a.last_name > b.last_name ? 1 : -1),
  }

  const dir = dirTxt === 'asc' ? 1 : -1;
  switch(type) {
    case 'Weight': // XXX
    case 'Text':
    case 'Gender':
    case 'Birth Date': return textFn;
    case 'Number':
    case 'TopScore ID':
    case 'Height':
    case 'Draft ID': return numberFn;
    case 'Image & Name': return imageNameFn[dirTxt];
    default: return textFn;
  }
}

export default function(pipeline, action) {

  let {players, columns, ui: {playersTabOptions: {sorts}}} = pipeline; // Get from pipeline if exists already

  let ret = players.slice(0);
  sorts.forEach(sort => {
    const split = sort.split('.');
    const column = columns.find(col => col.id === split[0]) || columns.find(col => col.id === 'last_name');
    if(column) {
      ret.sort(sortFns(column.id, column.type, split[1]));
    }
  });

  return ret;

}