import { GluegunCommand } from "gluegun"

const command: GluegunCommand = {
  name: 'mongodb',
  description: 'Adicionar estrutura de integração com o MongoDB',

  run: async toolbox => {
    const {
      askUseMongoDb,
      createStructureMongoDb,
      print: { error, success },
      system
    } = toolbox

    const isUseMongoDb = await askUseMongoDb()

    if(isUseMongoDb === 'Sim') {
      await system.run('npm install mongodb')
      await createStructureMongoDb()
      success(`✅ Estrutura de integração com o MongoDB criada com sucesso!`)
    } else {
      error('❌ Não foi possível adicionar estrutura de integração com o MongoDB')
    }
  }

}

module.exports = command
