module.exports = (toolbox) => {
  const {
    filesystem,
    configEditorConfig,
    configESLint,
    configMocha,
    configPrettier,
    configNPMrc,
    configEnv,
    configGitIgnore,
    configReport,
    createTemplatesMrAndIssues,
    updatePackage,
    createReadme,
    configUtils,
    configTestFile,
    configRouteFile,
    print: { info },
  } = toolbox

  async function createFolders() {
    await filesystem.dir('support/data/requests')
    await filesystem.dir('support/data/responses/schemas')
    await filesystem.dir('support/env')
    await filesystem.dir('support/helpers')
    await filesystem.dir('core/routes')
    await filesystem.dir('core/tests')
    await filesystem.dir('.gitlab/issue_templates')
    await filesystem.dir('.gitlab/merge_request_templates')

    info('Diretórios criados!')
  }

  async function createArchivesBase(projectName) {
    await updatePackage(projectName)
    await configEditorConfig()
    await configESLint()
    await configMocha()
    await configPrettier()
    await configNPMrc()
    await configEnv()
    await configReport()
    await configUtils()
    await configTestFile()
    await configRouteFile()
    await configGitIgnore()
    await createTemplatesMrAndIssues()
    await createReadme()

    await filesystem.file('support/helpers/commons.js')
    await filesystem.file('support/helpers/config.js')

    info('Arquivos base criados!')
  }

  toolbox.createFolders = createFolders
  toolbox.createArchivesBase = createArchivesBase
}
