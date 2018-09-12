const fs = require('fs');
const program = require('commander');

program
  .version('0.1.0')
  .option('-r, --runtime <runtime>', 'AWS platform runtime: node6.10 or node4.3', /^nodejs(?:4\.3|6\.10|8\.10)$/, 'nodejs8.10')
  .option('-o, --orders_file <orders_file>', 'Path to the orders file for the app being deployed' )
  .option('-s, --service <service>', 'Name of the service being deployed' )
  .option('-n, --container_name <container_name>', 'The name of the lxc container in which we are running' )
  .option('-h, --hq <hq>', 'location of the git remote for the headquarters ' )
  .option('-a, --account <account>', 'account ID of the AWS account being deployed to ' )
  .option('--ship <ship>', 'Name of the ship that has built this deployment.  Takes the form ip-172-121-12-11 ' )
;

module.exports = argv => {
  const params = program.parse(argv);

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
  if (typeof params.ship == 'undefined'){
    console.log('You must specify the ship name using the --ship option')
    process.exit(1)
}
  return params;
};
