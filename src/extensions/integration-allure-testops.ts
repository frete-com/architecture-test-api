import { GluegunToolbox } from "gluegun"
import supertest from 'supertest'

export default (toolbox: GluegunToolbox) => {
  const {
    configPipelineGitLabWithAllureTestOpsAndSlack,
    configPipelineGitLabWithAllureTestOpsWithoutSlack,
    filesystem,
    getChannelNameSlack,
    getURLWebhookSlack,
    print: { success, warning },
    template
  } = toolbox

  async function askUseAllureTestOps() {
    const { isUseAllureTestOps } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isUseAllureTestOps',
      message: '🗂️  Deseja integrar o novo projeto ao Allure TestOps?',
      choices: ['Sim', 'Não'],
    })

    return isUseAllureTestOps
  }

  async function askExistProjectAllureTestOps() {
    const { isExistProjectAllureTestOps } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isExistProjectAllureTestOps',
      message: '🗄  O repositório do projeto já existe no Allure TestOps?',
      choices: ['Sim', 'Não'],
    })

    return isExistProjectAllureTestOps
  }

  async function getUrlAllureTestOps() {
    let count =  0
    let statusUrl :boolean
    const formatUrl = /^(https?:\/\/).*\.testops\.cloud(\/?)$/

    do {
      count++

      let { url } =  await toolbox.prompt.ask({
        type: 'input',
        name: 'url',
        message:
          '🔗 Informe a URL do servidor Allure TestOps:',
      })

      statusUrl = formatUrl.test(url)
      if (!statusUrl) {
        warning('❌ Não foi informada uma URL válida!')
      } else {
        if (url.endsWith('/')) {
          url = url.slice(0, -1)
        }
        return url
      }
    } while (statusUrl === false && count < 3)

    return undefined
  }

  async function getTokenAllureTestOps() {
    const { token } = await toolbox.prompt.ask({
      type: 'input',
      name: 'token',
      message:
        '🔑 Informe o token de autenticação do Allure TestOps:',
    })

    return token
  }

  async function getIdProjectAllureTestOps() {
    const { idProject } = await toolbox.prompt.ask({
      type: 'input',
      name: 'idProject',
      message:
        '🆔 Informe o ID do projeto no Allure TestOps:',
    })

    return idProject
  }

  async function createProjectAllureTestOps(project: string) {
    let url = await getUrlAllureTestOps()

    if (url === undefined) {
      warning('🚨 Não foi possível integrar o projeto ao allure testops!')
      return undefined
    }

    let token = await getTokenAllureTestOps()
    let idProject = 0
    const response = await supertest(url)
      .post('/api/rs/project')
      .accept('application/json')
      .set('Authorization', `Api-Token ${token}`)
      .send({
        name: `${project}-api`,
        isPublic: false,
        favorite: false,
      })

    if (response.statusCode === 200) {
      success('✅ Projeto criado no Allure TestOps!')
      idProject = response.body.id
      return { url: url, token: token, id: idProject }
    } else if (response.statusCode === 409) {
      warning(`🚨 Possivelmente já existe um projeto registrado no TestOps com o nome ${project}-api`)
      return undefined
    } else {
      warning(`🚨 Não foi possível criar o projeto no Allure Test Ops | Error Status Code: ${response.status}`)

      return undefined
    }
  }

  async function integrateProjectAllureTestOps() {
    let url = await getUrlAllureTestOps()

    if (url != undefined) {
      let token = await getTokenAllureTestOps()
      let idProject = await getIdProjectAllureTestOps()

      return { url: url, token: token, id: idProject }
    }

    return url
  }

  async function generatePipelineFromNewProjectAllureTestOps(urlAllureTestOps: string, tokenAllureTestOps: string, idProjectAllureTestOps: number) {
    let urlWebhookSlack
    let channelNameSlack

    const { isIntegratedSlack } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isIntegratedSlack',
      message: '🔔 Deseja integrar o projeto também ao slack?',
      choices: ['Sim', 'Não'],
    })

    if (isIntegratedSlack === 'Sim') {
      urlWebhookSlack = await getURLWebhookSlack()
      channelNameSlack = await getChannelNameSlack()
      await configPipelineGitLabWithAllureTestOpsAndSlack(urlAllureTestOps, tokenAllureTestOps, idProjectAllureTestOps, urlWebhookSlack, channelNameSlack)
    } else {
      await configPipelineGitLabWithAllureTestOpsWithoutSlack(urlAllureTestOps, tokenAllureTestOps, idProjectAllureTestOps)
    }
  }

  async function defineVariablesAllureTestOpsInGitLabCI(urlAllureTestOps: string, tokenAllureTestOps: string, idProjectAllureTestOps: number) {
    return (
      '\n' +
      'variables: \n' +
      '\tALLURE_LAUNCH_NAME: "${CI_PROJECT_NAME} - ${CI_COMMIT_SHORT_SHA}" \n' +
      '\tALLURE_LAUNCH_TAGS: "${CI_COMMIT_REF_NAME}, ${CI_PIPELINE_SOURCE}, supertest" \n' +
      '\tALLURE_TESTPLAN_PATH: "./testplan.json" \n' +
      '\tALLURE_RESULTS: "./allure-results" \n' +
      `\tALLURE_ENDPOINT: ${urlAllureTestOps} \n` +
      `\tALLURE_PROJECT_ID: ${idProjectAllureTestOps} \n` +
      `\tALLURE_TOKEN: ${tokenAllureTestOps} \n`+
      '\tTESTS_ENDPOINT: "$URL" \n' +
      '\tTESTS_BRANCH: ${CI_COMMIT_REF_NAME} \n'
    )
  }

  async function addVariablesAllureTestOpsInGitLabCI(urlAllureTestOps: string, tokenAllureTestOps: string, idProjectAllureTestOps: number) {
    return (
      '\tALLURE_LAUNCH_NAME: "${CI_PROJECT_NAME} - ${CI_COMMIT_SHORT_SHA}" \n' +
      '\tALLURE_LAUNCH_TAGS: "${CI_COMMIT_REF_NAME}, ${CI_PIPELINE_SOURCE}, supertest" \n' +
      '\tALLURE_TESTPLAN_PATH: "./testplan.json" \n' +
      '\tALLURE_RESULTS: "./allure-results" \n' +
      `\tALLURE_ENDPOINT: ${urlAllureTestOps} \n` +
      `\tALLURE_PROJECT_ID: ${idProjectAllureTestOps} \n` +
      `\tALLURE_TOKEN: ${tokenAllureTestOps} \n`+
      '\tTESTS_ENDPOINT: "$URL" \n' +
      '\tTESTS_BRANCH: ${CI_COMMIT_REF_NAME} \n'
    )
  }

  async function addReport() {
    try {
      let fileReport = filesystem.exists('gitlab-ci.yml')
      if (fileReport !== false) {
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

  toolbox.askExistProjectAllureTestOps = askExistProjectAllureTestOps
  toolbox.askUseAllureTestOps = askUseAllureTestOps
  toolbox.createProjectAllureTestOps = createProjectAllureTestOps
  toolbox.integrateProjectAllureTestOps = integrateProjectAllureTestOps
  toolbox.generatePipelineFromNewProjectAllureTestOps = generatePipelineFromNewProjectAllureTestOps
  toolbox.defineVariablesAllureTestOpsInGitLabCI = defineVariablesAllureTestOpsInGitLabCI
  toolbox.addVariablesAllureTestOpsInGitLabCI = addVariablesAllureTestOpsInGitLabCI
}
