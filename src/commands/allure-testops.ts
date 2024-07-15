import { GluegunCommand } from "gluegun"
import * as fs from 'fs'
import * as YAML from 'yaml'

const command: GluegunCommand = {
  name: 'allure-testops',
  description: 'Integrar projeto ao Allure Test Ops',

  run: async toolbox => {
    const {
      addVariablesAllureTestOpsInGitLabCI,
      askExistProjectAllureTestOps,
      askIsIntegratedGitLab,
      askNameProject,
      askUseAllureTestOps,
      askUseGitLab,
      configPipelineGitLabWithAllureTestOpsWithoutSlack,
      configReport,
      createProjectAllureTestOps,
      createTemplatesMRAndIssues,
      defineVariablesAllureTestOpsInGitLabCI,
      filesystem,
      folderNameIsProjectName,
      integrateProjectAllureTestOps,
      print: { error, success },
      system
    } = toolbox

    let fileGitlabCI: boolean | string

    let isUseAllureTestOps = await askUseAllureTestOps()

    if (isUseAllureTestOps === 'Sim') {
      let urlAllureTestOps: string = ''
      let tokenAllureTestOps: string = ''
      let idProjectAllureTestOps: string = ''

      let isIntegratedGitLab = await askIsIntegratedGitLab()
      if (isIntegratedGitLab === 'Sim') {
        let isExistProjectAllureTestOps = await askExistProjectAllureTestOps()
        if (isExistProjectAllureTestOps === 'Sim') {
          const dataConfigAllureTestOps = await integrateProjectAllureTestOps()
          if (dataConfigAllureTestOps !== undefined) {
            urlAllureTestOps = dataConfigAllureTestOps.url
            tokenAllureTestOps = dataConfigAllureTestOps.token
            idProjectAllureTestOps = dataConfigAllureTestOps.id
          } else {
            error('❌ Não foi possível concluir o processo de integração, tente novamente!')
            await system.run('npm remove allure-mocha')
          }
        } else {
          let projectName = await folderNameIsProjectName()
          if(projectName == 'Não') {
            projectName = await askNameProject()
          }
          const dataConfigAllureTestOps = await createProjectAllureTestOps(projectName)
          if (dataConfigAllureTestOps !== undefined) {
            urlAllureTestOps = dataConfigAllureTestOps.url
            tokenAllureTestOps = dataConfigAllureTestOps.token
            idProjectAllureTestOps = dataConfigAllureTestOps.id
          } else {
            error('❌ Não foi possível concluir o processo de integração, tente novamente!')
            await system.run('npm remove allure-mocha')
          }
        }

        fileGitlabCI = filesystem.exists('.gitlab-ci.yml')
        if (fileGitlabCI === false) {
          error('❌ O arquivo de configuração da pipeline (.gitlab-ci.yml) não foi encontrado no diretório')
        } else {
          let configGitLabCi = fs.readFileSync('.gitlab-ci.yml', 'utf8')
          let configGitLabCiYml = YAML.parse(configGitLabCi)
          if(configGitLabCiYml.variables === undefined) {
            let contentLines = configGitLabCi.split('\n')
            const contentIndex = contentLines.findIndex(contentLines => contentLines.trim().startsWith('image'))
            contentLines.splice(contentIndex + 1, 0, await defineVariablesAllureTestOpsInGitLabCI(urlAllureTestOps, tokenAllureTestOps, idProjectAllureTestOps))
            configGitLabCi = contentLines.join('\n')
            fs.writeFileSync('.gitlab-ci.yml', configGitLabCi, 'utf8')
          } else {
            let contentLines = configGitLabCi.split('\n')
            const contentIndex = contentLines.findIndex(contentLines => contentLines.trim().startsWith('variables'))
            contentLines.splice(contentIndex + 1, 0, await addVariablesAllureTestOpsInGitLabCI(urlAllureTestOps, tokenAllureTestOps, idProjectAllureTestOps))
            configGitLabCi = contentLines.join('\n')
            fs.writeFileSync('.gitlab-ci.yml', configGitLabCi, 'utf8')
          }
          await configReport(isUseAllureTestOps)
          await system.run('npm install allure-mocha')
          success(`\n \n ✅ Integração com o Allure TestOps finalizada com sucesso!`)
        }
      } else {
        let isUseGitLab = await askUseGitLab()

        if(isUseGitLab === 'Sim') {
          let isExistProjectAllureTestOps = await askExistProjectAllureTestOps()
          if (isExistProjectAllureTestOps === 'Sim') {
            const dataConfigAllureTestOps = await integrateProjectAllureTestOps()
            if (dataConfigAllureTestOps !== undefined) {
              urlAllureTestOps = dataConfigAllureTestOps.url
              tokenAllureTestOps = dataConfigAllureTestOps.token
              idProjectAllureTestOps = dataConfigAllureTestOps.id

              await createTemplatesMRAndIssues()
              await configPipelineGitLabWithAllureTestOpsWithoutSlack(urlAllureTestOps, idProjectAllureTestOps, tokenAllureTestOps)
              await configReport(isUseAllureTestOps)
              await system.run('npm install allure-mocha')
              success(`\n \n ✅ Integração com o Allure TestOps finalizada com sucesso!`)
            } else {
              await system.run('npm remove allure-mocha')
              error('❌ Não foi possível concluir o processo de integração, tente novamente!')
            }
          } else {
            let projectName = await folderNameIsProjectName()
            if(projectName == 'Não') {
              projectName = await askNameProject()
            }
            const dataConfigAllureTestOps = await createProjectAllureTestOps(projectName)
            if (dataConfigAllureTestOps !== undefined) {
              urlAllureTestOps = dataConfigAllureTestOps.url
              tokenAllureTestOps = dataConfigAllureTestOps.token
              idProjectAllureTestOps = dataConfigAllureTestOps.id

              await createTemplatesMRAndIssues()
              await configPipelineGitLabWithAllureTestOpsWithoutSlack(urlAllureTestOps, idProjectAllureTestOps, tokenAllureTestOps)
              await configReport(isUseAllureTestOps)
              await system.run('npm install allure-mocha')
              success(`\n \n ✅ Integração com o Allure TestOps finalizada com sucesso!`)
            } else {
              await system.run('npm remove allure-mocha')
              error('❌ Não foi possível concluir o processo de integração, tente novamente!')
            }
          }
        } else {
          await system.run('npm remove allure-mocha')
          error('❌ Sem uso de pipeline não é possível utilizar a integração com Allure Test Ops.')
        }
      }
    } else {
      error('❌ Projeto não integrado ao Allure TestOps')
    }
  }
}

module.exports = command
