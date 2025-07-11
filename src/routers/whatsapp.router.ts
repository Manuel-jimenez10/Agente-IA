import { Request, Response, Router } from 'express';
import * as whatsappController from '@controllers/whatsapp.controller';
import * as cache from '@utils/cache'
const router = Router();

// Lo usa Whatsapp para la verificación inicial del webhook
router.get('/webhook', async (req: Request, res: Response) => {  

  try{

    const response = await whatsappController.verifyWebhook(
      req.query['hub.mode'] as string,
      req.query['hub.verify_token'] as string,
      req.query['hub.challenge'] as string
    )
    res.send(response);

  }catch(e: any){
     res.sendStatus(500)
  }

});

router.post('/webhook', async (req: Request, res: Response) => {

  try {

    if (req.body.entry?.[0]?.changes?.[0]?.value?.messages) {

      const messageId = req.body.entry[0].changes[0].value.messages[0].id
      const key = `message:${messageId}`
      const value = "true"
      const second = 86400

      const exists = await cache.get(key);

      if( !exists ){        
        await cache.setWithExpiration(key, second, value)
        await whatsappController.handleWebhook(
          req.body.object as string,
          req.body.entry[0].changes[0].value.metadata as any,
          req.body.entry[0].changes[0].value.contacts?.[0]?.profile as any,
          req.body.entry[0].changes[0].value.messages as any
        );
      }
    }

   res.sendStatus(200);

  } catch (e: any) {
    res.sendStatus(500);
  }
});

export default router;