import { GluegunToolbox } from "gluegun"

export default (toolbox: GluegunToolbox) => {
  const {
    print: { success, warning },
    template,
  } = toolbox

  async function askUseGitLab() {
    const { isUseGitLab } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isUseGitLab',
      message: '🔧 Deseja gerar o arquivo de configuração da pipeline de execução do projeto no GitLab?',
      choices: ['Sim', 'Não'],
    })

    return isUseGitLab
  }

  async function askIsIntegratedGitLab() {
    const { isIntegratedGitLab } = await toolbox.prompt.ask({
      type: 'select',
      name: 'isIntegratedGitLab',
      message: '🔧 O projeto está integrado ao GitLab?',
      choices: ['Sim', 'Não'],
    })

    return isIntegratedGitLab
  }

  async function configPipelineGitLabWithAllureTestOpsAndSlack(
    urlAllureTestOps: string,
    idProjectAllureTestOps: number,
    tokenAllureTestOps: string,
    urlWebhookSlack: string,
    channelNameSlack: string,
  ) {
    try {
      await template.generate({
        template: 'configs/gitlab-ci-with-allure-test-ops-and-slack.js.ejs',
        target: '.gitlab-ci.yml',
        props: {
          urlAllureTestOps: urlAllureTestOps,
          idProjectAllureTestOps: idProjectAllureTestOps,
          tokenAllureTestOps: tokenAllureTestOps,
          urlWebhookSlack: urlWebhookSlack,
          channelNameSlack: channelNameSlack,
        },
      })

      success('🔧 Arquivo de configuração da pipeline de execução do projeto no GitLab definido!')
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar o arquivo de configuração da pipeline do projeto (.gitlab-ci.yml) | ${e}`)
    }
  }

  async function configPipelineGitLabWithAllureTestOpsWithoutSlack(
    urlAllureTestOps: string,
    idProjectAllureTestOps: number,
    tokenAllureTestOps: string,
  ) {
    try{
      await template.generate({
        template: 'configs/gitlab-ci-with-allure-test-ops.js.ejs',
        target: '.gitlab-ci.yml',
        props: {
          urlAllureTestOps: urlAllureTestOps,
          idProjectAllureTestOps: idProjectAllureTestOps,
          tokenAllureTestOps: tokenAllureTestOps,
        },
      })

      success('🔧 Arquivo de configuração da pipeline de execução do projeto no GitLab definido!')
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar o arquivo de configuração da pipeline do projeto (.gitlab-ci.yml) | ${e}`)
    }
  }

  async function configPipelineGitLabWithSlackWithoutAllureTestOps(
    urlWebhookSlack: string,
    channelNameSlack: string,
  ) {
    try {
      await template.generate({
        template: 'configs/gitlab-ci-with-slack.js.ejs',
        target: '.gitlab-ci.yml',
        props: {
          urlWebhookSlack: urlWebhookSlack,
          channelNameSlack: channelNameSlack,
        },
      })

      success('🔧 Arquivo de configuração da pipeline de execução do projeto no GitLab definido!')
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar o arquivo de configuração da pipeline do projeto (.gitlab-ci.yml) | ${e}`)
    }
  }

  async function configPipelineGitLabWithoutAllureTestOpsAndSlack() {
    try {
      await template.generate({
        template: 'configs/gitlab-ci-without-allure-test-ops-and-slack.js.ejs',
        target: '.gitlab-ci.yml',
      })

      success('🔧 Arquivo de configuração da pipeline de execução do projeto no GitLab definido!')
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar o arquivo de configuração da pipeline do projeto (.gitlab-ci.yml) | ${e}`)
    }
  }

  async function createTemplatesMRAndIssues() {
    try {
      await template.generate({
        template: '/others/TEMPLATE_ISSUE.md.ejs',
        target: `.gitlab/issue_templates/TEMPLATE_ISSUE.md`,
      })

      await template.generate({
        template: '/others/TEMPLATE_MR_CHORE.md.ejs',
        target: `.gitlab/merge_request_templates/TEMPLATE_MR_CHORE.md`,
      })

      await template.generate({
        template: '/others/TEMPLATE_MR_DOC.md.ejs',
        target: `.gitlab/merge_request_templates/TEMPLATE_MR_DOC.md`,
      })

      await template.generate({
        template: '/others/TEMPLATE_MR_FEAT_FIX_IMPROVEMENT.md.ejs',
        target: `.gitlab/merge_request_templates/TEMPLATE_MR_FEAT_FIX_IMPROVEMENT.md`,
      })
    } catch (e: any) {
      warning(`🚨 Não foi possível gerar o arquivo de configuração da pipeline do projeto (.gitlab-ci.yml) | ${e}`)
    }
  }

  toolbox.askIsIntegratedGitLab = askIsIntegratedGitLab
  toolbox.askUseGitLab = askUseGitLab
  toolbox.configPipelineGitLabWithAllureTestOpsAndSlack = configPipelineGitLabWithAllureTestOpsAndSlack
  toolbox.configPipelineGitLabWithAllureTestOpsWithoutSlack = configPipelineGitLabWithAllureTestOpsWithoutSlack
  toolbox.configPipelineGitLabWithSlackWithoutAllureTestOps = configPipelineGitLabWithSlackWithoutAllureTestOps
  toolbox.configPipelineGitLabWithoutAllureTestOpsAndSlack = configPipelineGitLabWithoutAllureTestOpsAndSlack
  toolbox.createTemplatesMRAndIssues = createTemplatesMRAndIssues
}
