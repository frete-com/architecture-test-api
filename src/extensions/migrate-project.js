const isEmpty = require('lodash/isEmpty')

module.exports = (toolbox) => {
  const {
    filesystem,
    configNPMrc,
    configEditorConfig,
    configESLint,
    configMocha,
    configPrettier,
    configGitIgnore,
    configReport,
    createReadme,
    configUtils,
    print: { info, warning },
  } = toolbox

  async function migrateArchives() {
    try {
      await createReadme()
      if (filesystem.exists('support/config.js')) {
        filesystem.move('support/config.js', 'support/helpers/config.js', {
          overwrite: true,
        })
      }
      filesystem.move('fixtures/requestBody', 'support/data/requests', {
        overwrite: true,
      })
      filesystem.move('fixtures/responseBody', 'support/data/responses', {
        overwrite: true,
      })
      filesystem.remove('fixtures')
      const schemas = filesystem.find('support/data/responses/', {
        matching: '*Schema*.js',
      })

      if (schemas) {
        schemas.forEach((archive) => {
          const file = filesystem.inspect(archive)
          const subdirectories = archive.split('/')
          let count = 0
          let path
          subdirectories.forEach((directory) => {
            count++
            if (directory == 'responses') {
              path = subdirectories.slice(count, subdirectories.length - 1)
              path = path.join('/')
            }
          })
          filesystem.move(
            archive,
            `support/data/responses/schemas/${path}/${file.name}`,
            {
              overwrite: true,
            }
          )
          const existArchivesInFolder = filesystem.inspectTree(
            `support/data/responses/${path}/`
          )

          if (isEmpty(existArchivesInFolder.children)) {
            filesystem.remove(`support/data/responses/${path}`)
          }
        })
      }

      filesystem.move('support/routes', 'core/routes', {
        overwrite: true,
      })

      filesystem.move('test/', 'core/tests', {
        overwrite: true,
      })
      filesystem.move(
        'support/utils/allureAuthors.json',
        'support/helpers/allure-authors.json',
        {
          overwrite: true,
        }
      )

      filesystem.remove('support/utils')

      info('Arquivos migrados!')
    } catch (erro) {
      warning(`Erro ao migrar arquivos:' ${erro}`)
    }
  }

  async function changeFilename() {
    const filesCore = filesystem.find('core/', { matching: ['*[A-Z]*'] })
    const filesSupport = filesystem.find('support/', { matching: ['*[A-Z]*'] })

    const files = filesCore.concat(filesSupport)
    if (files) {
      files.forEach((file) => {
        file = file.toString()
        const filenameWithoutSpecificWords = file.replace(
          /Response|Bodies|Request|Schemas|Schema/g,
          (word) => ''
        )
        const filenameRemoveUppercase = filenameWithoutSpecificWords.replace(
          /[A-Z]/g,
          (letterUppercase) => '-' + letterUppercase.toLowerCase()
        )

        const filenameSubdirectories = filenameRemoveUppercase.split('/')
        const filename =
          filenameSubdirectories[filenameSubdirectories.length - 1]

        filesystem.rename(file, filename)
      })
    }
  }

  async function updateConfigArchives() {
    await configEditorConfig()
    await configESLint()
    await configMocha()
    await configPrettier()
    await configGitIgnore()
    await configReport()
    await configNPMrc()
    await configUtils()

    await filesystem.file('support/helpers/commons.js')

    info('Novos arquivos adicionados!')
  }

  toolbox.migrateArchives = migrateArchives
  toolbox.changeFilename = changeFilename
  toolbox.updateConfigArchives = updateConfigArchives
}
