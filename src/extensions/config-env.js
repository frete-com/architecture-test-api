module.exports = (toolbox) => {
  const {
    template,
    filesystem,
    print: { info },
  } = toolbox

  async function configEnv() {
    if (!filesystem.exists('.env')) {
      await template.generate({
        template: 'configs/env.js.ejs',
        target: '.env',
      })
    }

    if (!filesystem.exists('.env.example')) {
      await template.generate({
        template: 'configs/env.js.ejs',
        target: '.env.example',
      })
    }

    await template.generate({
      template: 'code/config-environment.js.ejs',
      target: 'support/env/config-environment.js',
    })

    info('Estrutura de ENV criada!')
  }

  toolbox.configEnv = configEnv
}
