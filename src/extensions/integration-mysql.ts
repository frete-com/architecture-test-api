import { GluegunToolbox } from "gluegun"

export default (toolbox: GluegunToolbox) => {
  const {
    filesystem,
    print: { info, success, warning },
    system,
    template
  } = toolbox

  async function askUseMySql() {
    const { isUseMySql } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isUseMySql',
      message: '🐬 Deseja adicionar ao projeto a integração com o MySQL?',
      choices: ['Sim', 'Não'],
    })

    return isUseMySql
  }

  async function createStructureMySQL() {
    try {
      await template.generate({
        template: 'mysql/connection.js.ejs',
        target: `support/database/mysql/connection.js`,
      })

      await template.generate({
        template: 'mysql/queries.js.ejs',
        target: `support/database/mysql/queries.js`,
      })

      success('🐬 Estrutura de conexão com MySQL criada!')
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar a estrutura de conexão com o MySQL | ${e}`)
      info(`❕ Execute o comando "mysql" após a criação para tentar novamente construir a estrutura.
      Se o erro persiste analise e se necessário crie uma issue no github
      (https://github.com/frete-com/architecture-test-api/issues) do projeto`)
      await system.run('npm remove mysql2')
      if(filesystem.exists('support/database/mongo')) {
        await system.run('rm -rf support/database/mysql')
      } else {
        await system.run('rm -rf support/database')
      }
    }
  }

  toolbox.askUseMySql = askUseMySql
  toolbox.createStructureMySQL = createStructureMySQL
}
