
const whitelist = [
  { name: 'Maxi Correa',       telephoneNumber: '5491146739397' },
  { name: 'Mariano Iturbe',        telephoneNumber: '5493435122308' },
  { name: 'Juan Nuñez', telephoneNumber: '5491164914421' },
  { name: 'Nicolas Nimis',   telephoneNumber: '5491141954972' },
  { name: 'Andrés Juarez',      telephoneNumber: '5491134417337' },
  { name: 'Ariel Robles',    telephoneNumber: '5491162117278' }
];

export async function isWhitelisted(telephoneNumber: string){    
    return whitelist.some(entry => entry.telephoneNumber === telephoneNumber);
}

export async function getWhitelist(){    
    return whitelist
}