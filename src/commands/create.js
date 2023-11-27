module.exports = {
  name: 'create',
  description: 'Create new api test project',
  run: async (toolbox) => {
    const {
      createFolders,
      createStructureMySQL,
      createStructureMongo,
      createArchivesBase,
      installDependecies,
      createGitlabCI,
      createProjectAllureTestOps,
      defineConfigSlack,
      system,
      print: { success },
    } = toolbox

    let url, token, id, webhook, channel

    const askNameProject = {
      type: 'input',
      name: 'project',
      message: 'Qual o nome do projeto a ser automatizado? (Ex: engine)',
    }

    const askMySql = {
      type: 'select',
      name: 'mysql',
      message: 'Você usará conexão com o MySQL?',
      choices: ['Sim', 'Não'],
    }

    const askMongo = {
      type: 'select',
      name: 'mongo',
      message: 'Você usará conexão com o MongoDB?',
      choices: ['Sim', 'Não'],
    }

    const questions = [askNameProject, askMySql, askMongo]
    const { project, mysql, mongo } = await toolbox.prompt.ask(questions)

    await createFolders()
    await createArchivesBase(project)

    if (mysql === 'Sim') {
      await createStructureMySQL()
    } else {
      await system.run('npm remove mysql2')
    }

    if (mongo === 'Sim') {
      await createStructureMongo()
    } else {
      await system.run('npm remove mongodb')
    }

    const askAllureTestOps = {
      type: 'select',
      name: 'testops',
      message: 'Deseja criar o novo projeto no AllureTestOps?',
      choices: ['Sim', 'Não'],
    }

    const { testops } = await toolbox.prompt.ask(askAllureTestOps)

    if (testops === 'Sim') {
      const dataConfigAllureTestops = await createProjectAllureTestOps(project)
      url = dataConfigAllureTestops.url
      id = dataConfigAllureTestops.id
      token = dataConfigAllureTestops.token
    }

    const askSlack = {
      type: 'select',
      name: 'slack',
      message: 'Deseja integrar o projeto ao slack?',
      choices: ['Sim', 'Não'],
    }

    const { slack } = await toolbox.prompt.ask(askSlack)

    if (slack === 'Sim') {
      const dataConfigSlack = await defineConfigSlack()
      webhook = dataConfigSlack.webhook
      channel = dataConfigSlack.channel
    }

    await createGitlabCI(url, id, token, webhook, channel, testops)
    await installDependecies()

    success(`Projeto ${project} criado!`)
  },
}
