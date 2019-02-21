class Userdb {
  constructor() {}
  async query (db, name) {
    await db.execute(`SELECT * FROM user_table WHERE name=${name}`)
  }
  async save (db, data) {
    await db.execute(`INSERT INTO user_table (name, password) VALUES (${data.name}, ${data.password})`)
  }
}
module.export = new Userdb()
