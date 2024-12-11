module.exports = (toolbox) => {
  const { filesystem, template } = toolbox

  async function configEditorConfig() {
    await template.generate({
      template: 'configs/editorconfig.js.ejs',
      target: '.editorconfig',
    })
  }

  async function configESLint() {
    await template.generate({
      template: 'configs/eslintignore.js.ejs',
      target: '.eslintignore',
    })

    await template.generate({
      template: 'configs/eslintrc.js.ejs',
      target: '.eslintrc',
    })
  }

  async function configMocha() {
    if (filesystem.exists('mochawesome-report')) {
      filesystem.remove('mochawesome-report')
    }

    await template.generate({
      template: 'configs/mocharc.json.ejs',
      target: '.mocharc.json',
    })
  }

  async function configPrettier() {
    await template.generate({
      template: 'configs/prettierrc.json.ejs',
      target: '.prettierrc.json',
    })
  }

  async function configReport() {
    await template.generate({
      template: 'code/report.js.ejs',
      target: 'support/helpers/report.js',
    })
  }

  async function configUtils() {
    await template.generate({
      template: 'code/utils.js.ejs',
      target: 'support/helpers/utils.js',
    })
  }

  async function configTestFile() {
      await template.generate({
        template: 'code/tests.test.js.ejs',
        target: 'core/tests/tests.test.js',
      })
  }

  async function configRouteFile() {
      await template.generate({
        template: 'code/routes.js.ejs',
        target: 'core/routes/route.js',
      })
  }

  toolbox.configEditorConfig = configEditorConfig
  toolbox.configUtils = configUtils
  toolbox.configESLint = configESLint
  toolbox.configMocha = configMocha
  toolbox.configPrettier = configPrettier
  toolbox.configReport = configReport
  toolbox.configTestFile = configTestFile
  toolbox.configRouteFile = configRouteFile

}
