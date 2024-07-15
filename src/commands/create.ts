import { GluegunCommand } from "gluegun"

const command: GluegunCommand ={
  name: 'create',
  description: 'Criar um novo projeto',

  run: async toolbox => {
    const {
      askNameProject,
      askExistProjectAllureTestOps,
      askUseAllureTestOps,
      askUseGitLab,
      askUseMongoDb,
      askUseMySql,
      askUseSlack,
      configDependenciesProject,
      configPipelineGitLabWithAllureTestOpsAndSlack,
      configPipelineGitLabWithAllureTestOpsWithoutSlack,
      configPipelineGitLabWithSlackWithoutAllureTestOps,
      configPipelineGitLabWithoutAllureTestOpsAndSlack,
      configProject,
      configReport,
      createFoldersStructure,
      createTemplatesMRAndIssues,
      createProjectAllureTestOps,
      createStructureMongoDb,
      createStructureMySQL,
      filesystem,
      getChannelNameSlack,
      getUrlWebhookSlack,
      installDependencies,
      integrateProjectAllureTestOps,
      system,
      print: { info, success, warning }
    } = toolbox

    const projectName = await askNameProject()

    await createFoldersStructure()
    await configProject(projectName)

    const isUseMySql = await askUseMySql()

    if (isUseMySql === 'Sim') {
      await createStructureMySQL()
    } else {
      if(filesystem.exists('support/database/mysql')) {
        await system.run('rm -rf support/database/mysql')
      }

      await system.run('npm remove mysql2')
    }

    const isUseMongoDb = await askUseMongoDb()

    if (isUseMongoDb === 'Sim') {
      await createStructureMongoDb()
    } else {
      if(filesystem.exists('support/database/mongo')) {
        await system.run('rm -rf support/database/mongo')
      }

      await system.run('npm remove mongodb')
    }

    const isUseGitLab = await askUseGitLab()
    let isUseAllureTestOps = 'Não'

    if (isUseGitLab === 'Sim' ) {
      await createTemplatesMRAndIssues()
      isUseAllureTestOps = await askUseAllureTestOps()

      let isExistProjectAllureTestOps: string = 'Não'
      let urlAllureTestOps: string = ''
      let tokenAllureTestOps: string = ''
      let idProjectAllureTestOps: string = ''


      if (isUseAllureTestOps === 'Sim') {
        isExistProjectAllureTestOps = await askExistProjectAllureTestOps()
        if(isExistProjectAllureTestOps === 'Não') {
          const dataConfigAllureTestOps = await createProjectAllureTestOps(projectName)
          if (dataConfigAllureTestOps === undefined) {
            info('❕  Caso deseje realizar a integração novamente execute o comando "allure-testops".')
            await system.run('npm remove allure-mocha')
            isUseAllureTestOps = 'Não'
          } else {
            urlAllureTestOps = dataConfigAllureTestOps.url
            tokenAllureTestOps = dataConfigAllureTestOps.token
            idProjectAllureTestOps = dataConfigAllureTestOps.id
          }
        } else {
          const dataConfigAllureTestOps = await integrateProjectAllureTestOps()
          if (dataConfigAllureTestOps === undefined) {
            info('❕  Caso deseje realizar a integração novamente execute o comando "allure-testops".')
            await system.run('npm remove allure-mocha')
            isUseAllureTestOps = 'Não'
          } else {
            urlAllureTestOps = dataConfigAllureTestOps.url
            tokenAllureTestOps = dataConfigAllureTestOps.token
            idProjectAllureTestOps = dataConfigAllureTestOps.id
          }
        }
      } else {
        isUseAllureTestOps = 'Não'
      }

      let isUseSlack = await askUseSlack()

      let channelNameSlack: string = ''
      let urlWebhookSlack: string = ''

      if (isUseSlack === 'Sim') {
        urlWebhookSlack = await getUrlWebhookSlack()
        if (urlWebhookSlack === undefined) {
          warning(`🚨 Não foi possível integrar o projeto ao slack pois a URL de conexão com o webhook é inválida!`)
          info('❕  Caso deseje realizar a integração novamente execute o comando "slack".')
          isUseSlack = 'Não'
        } else {
          channelNameSlack = await getChannelNameSlack()
        }
      }

      if (isUseAllureTestOps === 'Sim') {
        if (isUseSlack === 'Sim') {
          await configPipelineGitLabWithAllureTestOpsAndSlack(urlAllureTestOps, idProjectAllureTestOps, tokenAllureTestOps, urlWebhookSlack, channelNameSlack)
        } else {
          await configPipelineGitLabWithAllureTestOpsWithoutSlack(urlAllureTestOps, idProjectAllureTestOps, tokenAllureTestOps)
          await system.run('npm remove allure-mocha')
        }
      } else {
        if (isUseSlack === 'Sim') {
          await configPipelineGitLabWithSlackWithoutAllureTestOps(urlWebhookSlack, channelNameSlack)
        } else {
          await configPipelineGitLabWithoutAllureTestOpsAndSlack()
          await system.run('npm remove allure-mocha')
        }
      }
    } else {
      system.run('npm remove allure-mocha')
    }
    await configDependenciesProject(projectName, isUseAllureTestOps)
    await configReport(isUseAllureTestOps)
    await installDependencies()

    success(`\n \n ✅ Projeto ${projectName} criado!`)
  }
}

module.exports = command
