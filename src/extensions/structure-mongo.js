module.exports = (toolbox) => {
  const {
    filesystem,
    template,
    print: { info },
  } = toolbox

  async function createStructureMongo() {
    await filesystem.file('support/database/mongodb/queries.js')
    await template.generate({
      template: '/mongo/connection.js.ejs',
      target: `support/database/mongodb/connection.js`,
    })
    await template.generate({
      template: '/mongo/operations.js.ejs',
      target: `support/database/mongodb/operations.js`,
    })

    info('Estrutura do mongo criada!')
  }

  async function updateStructureMongo() {
    await template.generate({
      template: '/mongo/connection.js.ejs',
      target: `support/database/mongodb/connection.js`,
    })
    await template.generate({
      template: '/mongo/operations.js.ejs',
      target: `support/database/mongodb/operations.js`,
    })
  }

  toolbox.updateStructureMongo = updateStructureMongo
  toolbox.createStructureMongo = createStructureMongo
}
