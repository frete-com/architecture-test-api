module.exports = (toolbox) => {
  const {
    print: { error, warning },
  } = toolbox
  async function defineWebhookSlack() {
    const askWebhookSlack = {
      type: 'input',
      name: 'webhook',
      message: 'Qual a URL do webhook do slack?',
    }

    const { webhook } = await toolbox.prompt.ask(askWebhookSlack)

    return webhook
  }

  async function defineChannelSlack() {
    const askChannelSlack = {
      type: 'input',
      name: 'channel',
      message: 'Insira o nome do canal do slack',
    }

    const { channel } = await toolbox.prompt.ask(askChannelSlack)

    return channel
  }

  async function verifyWebhookSlack(webhook) {
    const regex =
      /^(https:\/\/hooks\.slack\.com\/services\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+$)/
    return regex.test(webhook)
  }

  async function defineConfigSlack() {
    let webhook = await defineWebhookSlack()

    if (!(await verifyWebhookSlack(webhook))) {
      warning('O Webhook é inválido, informe novamente!')

      url = await defineWebhookSlack()

      if (!(await verifyWebhookSlack(webhook))) {
        error('Webhook não configurado!')
        return { webhook: '', channel: '' }
      }
    }

    let channel = await defineChannelSlack()
    return { webhook: webhook, channel: channel }
  }

  toolbox.defineConfigSlack = defineConfigSlack
}
