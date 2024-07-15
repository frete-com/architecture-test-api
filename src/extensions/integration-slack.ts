import { GluegunToolbox } from "gluegun"

export default (toolbox: GluegunToolbox) => {
  const {
    print: { warning },
  } = toolbox

  async function askUseSlack() {
    const { isUseSlack } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isUseSlack',
      message: '🔔 Deseja integrar o projeto ao Slack?',
      choices: ['Sim', 'Não'],
  })

    return isUseSlack
  }

  async function getUrlWebhookSlack() {
    let count = 0
    let statusUrl :boolean
    const formatUrl = /^(https:\/\/hooks\.slack\.com\/services\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+$)/

    do {
      count++
      let { webhook } = await toolbox.prompt.ask({
        type: 'input',
        name: 'webhook',
        message: '🔗 Informe a URL do webhook do Slack:',
      })

      statusUrl = formatUrl.test(webhook)
      if (!statusUrl) {
        warning('❌ Não foi informada uma URL válida!')
      } else {
        if (webhook.endsWith('/')) {
          webhook = webhook.slice(0, -1)
        }

        return webhook
      }
    } while (statusUrl === false && count < 3)

    return undefined
  }

  async function getChannelNameSlack() {
    const { channelName } = await toolbox.prompt.ask({
      type: 'input',
      name: 'channelName',
      message: '🔔 Informe o nome do canal do Slack para envio das notificações:',
    })

    return channelName
  }

  async function defineVariablesSlackInGitLabCI(urlWebhookSlack: string, channelNameSlack: string) {
    return (
      '\n' +
      'variables: \n' +
      `  WEBHOOK: "${urlWebhookSlack}" \n` +
      `  SLACK_CHANNEL: "${channelNameSlack}" \n`
    )
  }

  async function addVariablesSlackInGitLabCI(urlWebhookSlack: string, channelNameSlack: string) {
    return (
      `  WEBHOOK: "${urlWebhookSlack}" \n` +
      `  SLACK_CHANNEL: "${channelNameSlack}" \n`
    )
  }

  toolbox.addVariablesSlackInGitLabCI = addVariablesSlackInGitLabCI
  toolbox.askUseSlack = askUseSlack
  toolbox.defineVariablesSlackInGitLabCI = defineVariablesSlackInGitLabCI
  toolbox.getUrlWebhookSlack = getUrlWebhookSlack
  toolbox.getChannelNameSlack = getChannelNameSlack
}
