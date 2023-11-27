module.exports = {
  name: 'migrate',
  description: 'Migrate a exist project for the new architecture',
  run: async (toolbox) => {
    const {
      migrateArchives,
      changeFilename,
      reinstallPackages,
      removeAllureResults,
      updateConfigArchives,
      updateGitlabCI,
      configEnv,
      updatePackage,
      updateStructureMySQL,
      updateStructureMongo,
      print: { success },
    } = toolbox

    await migrateArchives()
    await changeFilename()
    await removeAllureResults()
    await updateConfigArchives()
    await updateGitlabCI()
    await updatePackage()
    await reinstallPackages()
    await configEnv()
    await updateStructureMySQL()
    await updateStructureMongo()

    success('Migração concluída!')
  },
}
