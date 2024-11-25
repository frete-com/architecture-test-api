import { GluegunToolbox } from "gluegun"

export default (toolbox: GluegunToolbox) => {
  const {
    filesystem,
    print: { warning },
    template,
  } = toolbox

  async function createEnv() {
    try{
      filesystem.file('.env')
      filesystem.file('.env.example')
    } catch (e: any) {
      warning(`🚨 Não foi possível criar os arquivos .env e .env.example | ${e}`)
    }
  }

  async function configEnv() {
    try {
      await createEnv()
      await template.generate({
        template: 'code/config-environment.js.ejs',
        target: 'support/env/config-environment.js',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar a estrutura de gestão do uso de envs | ${e}`)
    }
  }

  async function configReport(isUseAllureTestOps: string) {
    try {
      if (isUseAllureTestOps === 'Sim') {
        await template.generate({
          template: 'code/report-with-allure.js.ejs',
          target: 'support/helpers/report.js',
        })
      } else {
        await template.generate({
          template: 'code/report-without-allure.js.ejs',
          target: 'support/helpers/report.js',
        })
      }
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar a estrutura de report | ${e}`)
    }
  }

  async function createGitIgnore() {
    try {
      await template.generate({
        template: 'configs/gitignore.js.ejs',
        target: '.gitignore',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível criar o arquivo .gitignore | ${e}`)
    }
  }

  async function createReadme(projectName: string) {
    try {
      await template.generate({
        template: '/others/README.md.ejs',
        target: 'README.md',
        props: { projectName }
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível criar o arquivo readme.MD | ${e}`)
    }
  }

  async function createUtils() {
    try {
      await template.generate({
        template: '/code/utils.js.ejs',
        target: 'support/helpers/utils.js',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível criar o arquivo utils.js | ${e}`)
    }
  }

  async function createCommons() {
    try {
      filesystem.file('support/helpers/commons.js')
    } catch (e: any) {
      warning(`🚨 Não foi possível criar o arquivo commons.js | ${e}`)
    }
  }

  async function createConfig() {
    try {
      filesystem.file('support/helpers/config.js')
    } catch (e: any) {
      warning(`🚨 Não foi possível criar o arquivo config.js | ${e}`)
    }
  }

  async function createTestFile() {
    try {
      await template.generate({
        template: 'code/tests.test.js.ejs',
        target: 'core/tests/tests.test.js',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível criar o arquivo test.js | ${e}`)
    }
  }

  async function createRouteFile() {
    try {
      await template.generate({
        template: 'code/routes.js.ejs',
        target: 'core/routes/route.js',
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível criar o arquivo route.js | ${e}`)
    }
  }
  

  toolbox.configEnv = configEnv
  toolbox.configReport = configReport
  toolbox.configUtils = createUtils
  toolbox.createConfig = createConfig
  toolbox.createCommons = createCommons
  toolbox.createGitIgnore = createGitIgnore
  toolbox.createReadme = createReadme
  toolbox.createTestFile = createTestFile
  toolbox.createRouteFile = createRouteFile

}
