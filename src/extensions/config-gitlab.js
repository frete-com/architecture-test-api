module.exports = (toolbox) => {
  const yaml = require('js-yaml')
  const { filesystem, template } = toolbox

  async function createGitlabCI(
    urlAllureTestOps = '',
    idProjectAllureTestOps = 0,
    tokenAllureTestOps = '',
    webhookSlack = '',
    channelSlack = '',
    testops = 'Sim'
  ) {
    if (testops === 'Sim') {
      await template.generate({
        template: 'configs/gitlab-ci.js.ejs',
        target: '.gitlab-ci.yml',
        props: {
          url: urlAllureTestOps,
          id: idProjectAllureTestOps,
          token: tokenAllureTestOps,
          webhookSlack: webhookSlack,
          channelSlack: channelSlack,
        },
      })
    } else {
      await template.generate({
        template: 'configs/gitlab-ci-without-allure.js.ejs',
        target: '.gitlab-ci.yml',
        props: {
          webhookSlack: webhookSlack,
          channelSlack: channelSlack,
        },
      })
    }
  }

  async function configGitIgnore() {
    await template.generate({
      template: 'configs/gitignore.js.ejs',
      target: '.gitignore',
    })
  }

  async function updateGitlabCI() {
    const file = filesystem.read('.gitlab-ci.yml')
    const data = yaml.load(file)

    const allureEndpoint = data.variables['ALLURE_ENDPOINT']
    const allureProjectID = data.variables['ALLURE_PROJECT_ID']
    const allureToken = data.variables['ALLURE_TOKEN']
    const webhookSlack = data.variables['WEBHOOK']
    const slackChannel = data.variables['SLACK_CHANNEL']

    await createGitlabCI(
      allureEndpoint,
      allureProjectID,
      allureToken,
      webhookSlack,
      slackChannel
    )
  }

  async function createTemplatesMrAndIssues() {
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
  }

  async function createReadme() {
    if (filesystem.exists('README.md')) {
      filesystem.remove('README.md')
    }

    await template.generate({
      template: '/others/README.md.ejs',
      target: `README.md`,
    })
  }

  toolbox.createReadme = createReadme
  toolbox.createGitlabCI = createGitlabCI
  toolbox.configGitIgnore = configGitIgnore
  toolbox.updateGitlabCI = updateGitlabCI
  toolbox.createTemplatesMrAndIssues = createTemplatesMrAndIssues
}
