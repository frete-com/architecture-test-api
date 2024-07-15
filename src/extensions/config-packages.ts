import { GluegunToolbox } from "gluegun"

export default (toolbox: GluegunToolbox) => {
  const {
    print: { success, warning },
    template,
    system,

  } = toolbox

  async function configEditorConfig() {
    try {
      await template.generate({
        template: 'configs/editor-config.js.ejs',
        target: '.editorconfig',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível definir a configuração do EditorConfig | ${e}`)
    }
  }

  async function configESLint() {
    try {
      await template.generate({
        template: 'configs/eslint-ignore.js.ejs',
        target: '.eslintignore',
      })

      await template.generate({
        template: 'configs/eslintrc.js.ejs',
        target: '.eslintrc',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível definir a configuração do ESLint | ${e}`)
    }
  }

  async function configMocha() {
    try {
      await template.generate({
        template: 'configs/mocharc.json.ejs',
        target: '.mocharc.json',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível definir a configuração do Mocha | ${e}`)
    }
  }

  async function configPrettier() {
    try {
      await template.generate({
        template: 'configs/prettierrc.json.ejs',
        target: '.prettierrc.json',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível definir a configuração do Prettier | ${e}`)
    }
  }

  async function installDependencies() {
    try {
      await system.run('npm install')
      success('💻 Instalada as dependências do projeto!')
    } catch (e: any) {
      warning(`🚨 Não foi possível instalar as dependências do projeto | ${e}`)
    }
  }

  async function configPackageJson(projectName: string, isUseAllureTestOps: string) {
    try {
      if (!projectName.includes('-api-test')) {
        projectName = `${projectName.replace(' ', '-')}-api-test`
      }

      if(isUseAllureTestOps === 'Sim') {
        await template.generate({
          template: 'configs/package.js.ejs',
          target: 'package.json',
          props: { projectName },
        })
      } else {
        await template.generate({
          template: 'configs/package-without-allure.js.ejs',
          target: 'package.json',
          props: { projectName },
        })
      }
    } catch (e: any) {
      warning(`🚨 Não foi possível definir o package.json | ${e}`)
    }
  }

  async function configNPM() {
    try {
      await template.generate({
        template: 'configs/npmrc.js.ejs',
        target: '.npmrc',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível definir a configuração do NPM | ${e}`)
    }
  }

  toolbox.configNPM = configNPM
  toolbox.configPackageJson = configPackageJson
  toolbox.installDependencies = installDependencies
  toolbox.configEditorConfig = configEditorConfig
  toolbox.configESLint = configESLint
  toolbox.configMocha = configMocha
  toolbox.configPrettier = configPrettier
}
