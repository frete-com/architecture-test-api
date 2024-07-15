import { GluegunToolbox } from "gluegun"

export default (toolbox: GluegunToolbox) => {
  const {
    filesystem,
    system,
    template,
    print: { info, success, warning },
  } = toolbox

  async function askUseMongoDb() {
    const { isUseMongoDb } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isUseMongoDb',
      message: '🍃 O projeto terá integração com o MongoDB?',
      choices: ['Sim', 'Não'],
    })

    return isUseMongoDb
  }

  async function createStructureMongoDb() {
    try {
      await template.generate({
        template: '/mongo/connection.js.ejs',
        target: `support/database/mongodb/connection.js`,
      })
  
      await template.generate({
        template: '/mongo/operations.js.ejs',
        target: `support/database/mongodb/operations.js`,
      })
  
      await template.generate({
        template: '/mongo/queries.js.ejs',
        target: `support/database/mongodb/queries.js`,
      })
  
      success('🍃 Estrutura de conexão com MongoDB criada!')
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar a estrutura de conexão com o MongoDB | ${e}`)
      info(`❕ Execute o comando "mongodb" após a criação para tentar novamente construir a estrutura. 
      Se o erro persiste analise e se necessário crie uma issue no github 
      (https://github.com/frete-com/architecture-test-api/issues) do projeto`)
      await system.run('npm remove mongodb')
      if(filesystem.exists('support/database/mysql')) {
        await system.run('rm -rf support/database/mongodb')
      } else {
        await system.run('rm -rf support/database')
      }
    }

  }

  toolbox.askUseMongoDb = askUseMongoDb
  toolbox.createStructureMongoDb = createStructureMongoDb
}
