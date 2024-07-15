import { GluegunCommand } from "gluegun"

const command: GluegunCommand = {
  name: 'mysql',
  description: 'Adicionar estrutura de integração com o MySQL',

  run: async toolbox => {
    const {
      askUseMySql,
      createStructureMySQL,
      print: { error, success },
      system
    } = toolbox

    const isUseMySql = await askUseMySql()

    if(isUseMySql === 'Sim') {
      await system.run('npm install mysql2')
      await createStructureMySQL()
      success(`✅ Estrutura de integração com o MySQL criada com sucesso!`)
    } else {
      error('❌ Não foi possível adicionar estrutura de integração com o MySQL')
    }
  }

}

module.exports = command
