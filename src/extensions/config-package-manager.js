module.exports = (toolbox) => {
  const {
    filesystem,
    template,
    system,
    print: { info },
  } = toolbox

  async function installDependecies() {
    await system.run('npm i')

    info('Dependências do projeto instaladas!')
  }

  async function reinstallPackages() {
    filesystem.remove('package-lock.json')
    filesystem.remove('node_modules')
    await installDependecies()
  }

  async function updatePackage(projectName) {
    if (filesystem.exists('package.json')) {
      const file = filesystem.read('package.json', 'json')
      projectName = file['name']
    } else {
      projectName = `${projectName.replaceAll(' ', '-')}-api-test`
    }

    await template.generate({
      template: 'configs/package.js.ejs',
      target: 'package.json',
      props: { name: projectName },
    })
  }

  async function configNPMrc() {
    await template.generate({
      template: 'configs/npmrc.js.ejs',
      target: '.npmrc',
    })
  }

  toolbox.configNPMrc = configNPMrc
  toolbox.updatePackage = updatePackage
  toolbox.installDependecies = installDependecies
  toolbox.reinstallPackages = reinstallPackages
}
