const fs = require('fs')
const path = require('path')

const members = require('./backup.json')

const clone = () => {
  // 深拷贝
  return JSON.parse(JSON.stringify(members))
}

const save = () => {
  const json = JSON.stringify(members, null, 2)
  fs.writeFileSync(path.join(__dirname, './backup.json'), json)
}

module.exports = {
  get: () => {
    return clone().sort((a, b) => b.id - a.id)
  },
  getByPage: (page, limit) => {
    const temp = clone().sort((a, b) => b.id - a.id)
    const skip = (page - 1) * limit
    return temp.splice(skip, limit)
  },
  getByLast: (last, limit) => {
    const temp = clone().sort((a, b) => b.id - a.id)
    const exist = temp.find(t => t.id === last)
    const skip = exist ? temp.indexOf(exist) : 0
    return temp.splice(skip + 1, limit)
  },
  getById: id => {
    const temp = clone().sort((a, b) => b.id - a.id)
    return temp.find(t => t.id === id)
  },
  add: member => {
    // 自增 id
    const ids = members.map(m => m.id)
    members.push(Object.assign({
      id: ids.length ? Math.max(...ids) + 1 : 1
    }, member))
    save()
  },
  delete: id => {
    const del = members.find(m => m.id === id)
    if (!del) {
      // 数据不存在
      return false
    }
    members.splice(members.indexOf(del), 1)
    save()
    return true
  }
}
