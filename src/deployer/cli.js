const fs = require('fs');
const program = require('commander');

program
  .version('0.1.0')
  // .option('-p, --path <absolute_path>', 'Absolute path to directory of app to deploy')
  .option('-r, --runtime <runtime>', 'AWS platform runtime: node6.10 or node4.3', /^nodejs(?:4\.3|6\.10|8\.10)$/, 'nodejs8.10')
  .option('-o, --orders_file <orders_file>', 'Path to the orders file for the app being deployed' )
  .option('-s, --service <service>', 'Name of the service being deployed' )
  .option('-n, --container_name <container_name>', 'The name of the lxc container in which we are running' )
  .option('-h, --hq <hq>', 'location of the git remote for the headquarters ' )
  .option('-a, --account <account>', 'account ID of the AWS account being deployed to ' )
;

module.exports = argv => {
  const params = program.parse(argv);

  // Require user to specify directory to deploy
  /*
  if (typeof params.path == 'undefined'){
      console.error('You must specify the directory where the applicaiton to deploy is located');
      process.exit(1)
  }
  */

  if (params.runtime != 'nodejs6.10' && params.runtime != 'nodejs4.3' && params.runtime != 'nodejs8.10'){
      console.log('Supported runtimes values are nodejs8.10, nodejs6.10 and nodejs4.3. You entered \'' + params.runtime + '\'')
      console.log('Setting runtime to nodejs8.10')
      params.runtime = 'nodejs8.10'
  }

  if (typeof params.orders_file == 'undefined'){
      console.log('You must specify the orders file for the application being deployed')
      process.exit(1)
  }

  if (! fs.existsSync(params.orders_file) ){
      console.log('The orders file path you specified does not exist: ' + params.orders_file)
      process.exit(1)
  }

  if (typeof params.service == 'undefined'){
      console.log('You must specify service name using the --service or -s option')
      process.exit(1)
  }

  if (typeof params.container_name == 'undefined'){
      console.log('You must specify service name using the --service or -s option')
      process.exit(1)
  }

  if (typeof params.hq == 'undefined'){
      console.log('You must specify HQ Remote using the --hq or -h option')
      process.exit(1)
  }

  return params;
};
