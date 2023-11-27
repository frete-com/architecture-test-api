module.exports = (toolbox) => {
  const request = require('supertest')
  const {
    filesystem,
    print: { error, info, warning },
  } = toolbox

  async function defineURLAllureTestOps() {
    const askURLAllureTestOps = {
      type: 'input',
      name: 'url',
      message:
        'Qual a URL do servidor do Allure TestOps (mesma url de acesso)?',
    }

    const { url } = await toolbox.prompt.ask(askURLAllureTestOps)

    return url
  }

  async function defineTokenAllureTestOps() {
    const askTokenAllureTestOps = {
      type: 'input',
      name: 'token',
      message:
        'Insira o token de autenticação do Allure TestOps (your profile > create (sessão api token)',
    }

    const { token } = await toolbox.prompt.ask(askTokenAllureTestOps)

    return token
  }

  async function verifyUrlAllureTestOps(url) {
    const regex = /^(https?:\/\/).*\.testops\.cloud(\/?)$/
    return regex.test(url)
  }

  async function createProjectAllureTestOps(project) {
    let id
    let url = await defineURLAllureTestOps()

    if (!(await verifyUrlAllureTestOps(url))) {
      warning('A url é inválida, informe novamente!')

      url = await defineURLAllureTestOps()

      if (!(await verifyUrlAllureTestOps(url))) {
        error('Projeto não criado no Allure TestOps!')
        return { url: '', token: '', id: '' }
      }
    }

    let token = await defineTokenAllureTestOps()

    if (url.endsWith('/')) {
      url = url.slice(0, -1)
    }

    await request(url)
      .post('/api/rs/project')
      .accept('application/json')
      .set('Authorization', `Api-Token ${token}`)
      .send({
        name: `${project}-api`,
        isPublic: false,
        favorite: false,
      })
      .expect(200)
      .then(async (response) => {
        info('Criado projeto no Allure TestOps!')
        id = response.body.id
      })
      .catch(async (erro) => {
        error(`Não foi possível criar o projeto no Allure Test Ops: ${erro}`)
      })

    return { url: url, token: token, id: id }
  }

  async function removeAllureResults() {
    filesystem.remove('allure-results')
  }

  toolbox.createProjectAllureTestOps = createProjectAllureTestOps
  toolbox.removeAllureResults = removeAllureResults
}
