import * as ip from 'ip';
import { CoreServico } from '../../core/Servico';


export class UtilSvc extends CoreServico {

    getIpServidor = async () => {
        const address = await  ip.address()
        this.resposta.json({ip: address})
    }

    getVersao = async () => {
      var pjson = require('../../../package.json');
      this.resposta.send(pjson.version);
  }

}