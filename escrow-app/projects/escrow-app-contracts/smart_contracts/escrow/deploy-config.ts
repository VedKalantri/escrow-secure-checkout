import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { EscrowFactory } from '../artifacts/escrow/EscrowClient'

export async function deploy() {
  console.log('=== Deploying Escrow ===')

  const algorand = AlgorandClient.fromEnvironment()
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')

  const factory = algorand.client.getTypedAppFactory(EscrowFactory, {
    defaultSender: deployer.addr,
  })

  const { appClient, result } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  if (['create', 'replace'].includes(result.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    })
  }

  console.log(`Escrow deployed successfully`)
  console.log(`App ID: ${appClient.appId}`)
  console.log(`App Address: ${appClient.appAddress}`)
}