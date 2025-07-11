import * as error from '@utils/error'
import { ethers } from 'ethers';
import * as config from '@config/config'

export async function saveHash(hash: string): Promise<{txid: string, timestamp: number}> {

	try{		
	  
	  	const provider = new ethers.JsonRpcProvider(config.PROVIDER_URL);
	  	const wallet = new ethers.Wallet(config.OWNER_PRIVATE_KEY, provider);
		const contract = new ethers.Contract(config.CONTRACT_ADDRESS, config.CONTRACT_ABI, wallet);
	
		const tx = await contract.setHash('0x'+hash);
		const receipt = await tx.wait();
		
		const block = await provider.getBlock(receipt.blockNumber);		
		const timestamp = block ? block.timestamp : 0;
    	   		
    	return { txid: receipt.hash, timestamp: timestamp }

	}catch(e: any){				
		throw await error.createError(e)
	}

}
    