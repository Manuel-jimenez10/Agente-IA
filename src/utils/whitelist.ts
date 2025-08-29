export async function isWhitelisted(telephoneNumber: string){    
    return whitelist.some(entry => entry.telephoneNumber === telephoneNumber);
}

export async function getWhitelist(){    
    return whitelist
}