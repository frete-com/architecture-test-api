module.exports = (toolbox) => {
  const {
    filesystem,
    template,
    print: { info },
  } = toolbox

  async function createStructureMySQL() {
    await filesystem.file('support/database/mysql/queries.js')
    await template.generate({
      template: 'mysql/connection.js.ejs',
      target: `support/database/mysql/connection.js`,
    })

    info('Estrutura do MySQL criada!')
  }

  async function updateStructureMySQL() {
    await template.generate({
      template: 'mysql/connection.js.ejs',
      target: `support/database/mysql/connection.js`,
    })

    info('Estrutura do MySQL criada!')
  }

  toolbox.createStructureMySQL = createStructureMySQL
  toolbox.updateStructureMySQL = updateStructureMySQL
}
