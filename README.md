Homepage, where people can enter their data, pay a lightning network bill, and receive their corresponding Gittins Index.

The site is danishlightning.dk/index.php

The code must use the lnd gRPC server to obtain the bill, and check if it has been paid. A gRPC server - to be programmed as well (if we do not just do it with an EXEC command) - must supply the Gittins Index itself.

Det jeg prøver at lave er en service som
1) https://starblocks.acinq.co/#/
2) https://yalls.org/

Hvis du vil prøve dem kan du 

1) Downloade en testnet wallet til din telefon. App-Store, søg: BTC lightning. Installer den med lightning symbolet, som hedder "testnet", ikke Eclairs; de har problemer.
2) Få nogle matador penge. Flere muligheder:
	a) Send mig din adresse og jeg giver dig nogle
	b) Gå ind på https://testnet.manu.backend.hamburg/faucet, og få nogle der.
3) Åbn en betalingskanal (channel)
	a) Vent på at overførslen til din wallet er bekræftet nogle gange på blockchainen, så du kan bruge pengene.
	b) Vælg node, for eksempel DanishLightning.dk
	c) Et beløb, for eksempel 50 mBTC.
	d) Vent på at aftalen er bekræftet 3 gange på Blockchainen.