import { build } from 'gluegun'
import { Options } from 'gluegun/build/types/domain/options'

async function run(argv: string | Options | undefined) {
  const cli = build()
    .brand('architecture-test-api')
    .src(__dirname)
    .plugins('./node_modules', {
      matching: 'architecture-test-api-*',
      hidden: true,
    })
    .help()
    .version()
    .create()

  const toolbox = await cli.run(argv)

  return toolbox
}

module.exports = { run }
