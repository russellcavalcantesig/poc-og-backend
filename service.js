const Service = require('node-windows').Service;
const action = process.argv.pop();

const configuration = {
    name: 'OficinaGaragemBackend',
    description: 'Sistema de Gestão da Oficina Garagem',
    script: 'C:\\Projeto\\OficinaGaragem\\backend\\dist\\server.js'
}
const svc = new Service(configuration);

if(action == 'install'){
    svc.on('install', function () { 
        console.log('Serviço Instalado com Sucesso.');
        svc.start();
     });
    svc.install();
}else if(action == 'uninstall'){
    svc.on('uninstall', function () {
        console.log('Serviço Desinstalado com Sucesso.');
    });
    svc.uninstall();
}