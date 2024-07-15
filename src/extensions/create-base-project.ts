import * as path from 'path'
import { GluegunToolbox } from "gluegun"

export default (toolbox: GluegunToolbox) => {
  const {
    configEditorConfig,
    configEnv,
    configESLint,
    configMocha,
    configNPM,
    configPackageJson,
    configPrettier,
    createReadme,
    configReport,
    configUtils,
    createGitIgnore,
    filesystem,
    print: { error, info, success },
    system
  } = toolbox

  async function askNameProject() {
    const { projectName } = await toolbox.prompt.ask({
      type: 'input',
      name: 'projectName',
      message: '📂 Insira o nome do projeto',
      initial: 'freight-search'
    })

    return projectName
  }

  async function folderNameIsProjectName() {
    const currentFolder = path.basename(process.cwd())

    const { isProjectName } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isProjectName',
      message: `📂 O nome deste projeto é ${currentFolder}?`,
      choices: ['Sim', 'Não'],
    })

    if (isProjectName === 'Sim')
      return currentFolder
    else
      return isProjectName
  }

  async function createFoldersStructure() {
    try {
      filesystem.dir('support/data/requests')
      filesystem.dir('support/data/responses/schemas')
      filesystem.dir('support/env')
      filesystem.dir('support/helpers')
      filesystem.dir('core/routes')
      filesystem.dir('core/tests')

      success('📂 Diretórios iniciais do projeto criados!')
    } catch (e: any) {
      error(`❌ Não foi possível criar a estrutura de pastas do projeto | ${e}`)
      await system.run('rm -rf *')
      info(`❕ Execute novamente o comando "create". Se o erro persiste analise e se necessário crie uma issue no
      github (https://github.com/frete-com/architecture-test-api/issues) do projeto`)
      process.exit(0)
    }
  }

  async function configProject(projectName: string) {
    try {
      await configEnv()
      await configReport()
      await configUtils()
      await createGitIgnore()
      await createReadme(projectName)

      success('📄 Configuração base realizada!')
    } catch (e: any) {
      error(`❌ Não foi possível definir as configurações do projeto | ${e}`)
      await system.run('rm -rf *')
      info(`❕ Execute novamente o comando "create". Se o erro persiste analise e se necessário crie uma issue no
      github (https://github.com/frete-com/architecture-test-api/issues) do projeto`)
      process.exit(0)
    }
  }

  async function configDependenciesProject(projectName: string, isUseAllureTestOps: string) {
    try {
      await configPackageJson(projectName, isUseAllureTestOps)
      await configEditorConfig()
      await configESLint()
      await configMocha()
      await configPrettier()
      await configNPM()

      success('🔧 Dependências iniciais configuradas! \n')
    } catch (e: any) {
      error(`❌ Não foi possível definir as configurações das dependências do projeto | ${e}`)
      await system.run('rm -rf *')
      info(`❕ Execute novamente o comando "create". Se o erro persiste analise e se necessário crie uma issue no
      github (https://github.com/frete-com/architecture-test-api/issues) do projeto`)
      process.exit(0)
    }
  }

  toolbox.askNameProject = askNameProject
  toolbox.configDependenciesProject = configDependenciesProject
  toolbox.configProject = configProject
  toolbox.createFoldersStructure = createFoldersStructure
  toolbox.folderNameIsProjectName = folderNameIsProjectName
}
