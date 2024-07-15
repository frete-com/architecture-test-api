import { GluegunCommand } from "gluegun"
import * as fs from 'fs'
import * as YAML from 'yaml'

const command: GluegunCommand = {
  name: 'slack',
  description: 'Adicionar estrutura de integração com o Slack',

  run: async toolbox => {
    const {
      addVariablesSlackInGitLabCI,
      askIsIntegratedGitLab,
      askUseGitLab,
      askUseSlack,
      configPipelineGitLabWithSlackWithoutAllureTestOps,
      createTemplatesMRAndIssues,
      defineVariablesSlackInGitLabCI,
      filesystem,
      getChannelNameSlack,
      getUrlWebhookSlack,
      print: { error, success },

    } = toolbox

    const isUseSlack = await askUseSlack()

    let urlWebhookSlack = ''
    let channelNameSlack = ''

    if(isUseSlack === 'Sim') {
      let isIntegratedGitLab = await askIsIntegratedGitLab()
      if (isIntegratedGitLab === 'Sim') {
        urlWebhookSlack = await getUrlWebhookSlack()
        if (urlWebhookSlack === undefined) {
          error('❌ Não foi possível adicionar estrutura de integração com o Slack!')
        } else {
          channelNameSlack = await getChannelNameSlack()

          let fileGitlabCI = filesystem.exists('.gitlab-ci.yml')
          if (fileGitlabCI === false) {
            error('❌ O arquivo de configuração da pipeline (.gitlab-ci.yml) não foi encontrado no diretório!')
          } else {
            let configGitLabCi = fs.readFileSync('.gitlab-ci.yml', 'utf8')
            let configGitLabCiYml = YAML.parse(configGitLabCi)
            if(configGitLabCiYml.variables === undefined) {
              let contentLines = configGitLabCi.split('\n')
              const contentIndex = contentLines.findIndex(contentLines => contentLines.trim().startsWith('image'))
              contentLines.splice(contentIndex + 1, 0, await defineVariablesSlackInGitLabCI(urlWebhookSlack, channelNameSlack))
              configGitLabCi = contentLines.join('\n')
              fs.writeFileSync('.gitlab-ci.yml', configGitLabCi, 'utf8')
            } else {
              let contentLines = configGitLabCi.split('\n')
              const contentIndex = contentLines.findIndex(contentLines => contentLines.trim().startsWith('variables'))
              contentLines.splice(contentIndex + 1, 0, await addVariablesSlackInGitLabCI(urlWebhookSlack, channelNameSlack))
              configGitLabCi = contentLines.join('\n')
              fs.writeFileSync('.gitlab-ci.yml', configGitLabCi, 'utf8')
            }
          }
        }
      } else {
        let isUseGitLab = await askUseGitLab()

        if(isUseGitLab === 'Sim') {
          urlWebhookSlack = await getUrlWebhookSlack()
          if (urlWebhookSlack === undefined) {
            error('❌ Não foi possível adicionar estrutura de integração com o Slack')
          } else {
            channelNameSlack = await getChannelNameSlack()
            await createTemplatesMRAndIssues()
            await configPipelineGitLabWithSlackWithoutAllureTestOps(urlWebhookSlack, channelNameSlack)
            success(`✅ Integração com o Slack finalizada com sucesso!`)
          }
        }
      }
    } else {
      error('❌ Não foi possível adicionar estrutura de integração com o Slack!')
    }
  }

}

module.exports = command
